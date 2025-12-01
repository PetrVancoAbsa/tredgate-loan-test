#!/bin/bash
set -e

LOG_FILE="$1"
RUN_ID="$2"
COMMIT_SHA="$3"

REPO_OWNER=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f1)
REPO_NAME=$(echo "$GITHUB_REPOSITORY" | cut -d'/' -f2)

# Read logs
if [ -f "$LOG_FILE" ]; then
  LOGS=$(tail -100 "$LOG_FILE")
else
  LOGS="No logs available"
fi

# Build issue body
ISSUE_BODY=$(cat <<EOF
## 🔴 Self-Healing Required

A test has failed and requires automated fixing.

### Failure Details
| Detail | Value |
|--------|-------|
| **Workflow Run** | [View Run](https://github. com/${GITHUB_REPOSITORY}/actions/runs/${RUN_ID}) |
| **Commit** | \`${COMMIT_SHA}\` |
| **Branch** | \`${GITHUB_REF_NAME}\` |

### Error Logs
\`\`\`
${LOGS}
\`\`\`

### Instructions for Copilot
1.  Analyze the error logs above
2. Identify the root cause of the failure
3.  Fix the failing test or the code it tests
4. Create a pull request with the fix
5. Ensure all tests pass
EOF
)

ISSUE_TITLE="🤖 Self-Healing: Test failure on ${GITHUB_REF_NAME}"

echo "Creating new self-healing issue..."

# Step 1: Create the issue WITHOUT assignee first
ISSUE_URL=$(gh issue create \
  --title "$ISSUE_TITLE" \
  --body "$ISSUE_BODY" \
  --label "bug" \
  --label "automated" \
  2>&1)

# Extract issue number from URL
ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')

echo "Issue created: $ISSUE_URL (Issue #$ISSUE_NUMBER)"

# Step 2: Get the issue node ID using GraphQL
echo "Getting issue node ID..."
ISSUE_NODE_ID=$(gh api graphql -f query='
  query($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      issue(number: $number) {
        id
      }
    }
  }
' -f owner="$REPO_OWNER" -f repo="$REPO_NAME" -F number="$ISSUE_NUMBER" --jq '.data.repository.issue.id')

echo "Issue Node ID: $ISSUE_NODE_ID"

# Step 3: Get Copilot's user/actor ID
echo "Getting Copilot actor ID..."
COPILOT_ID=$(gh api graphql -f query='
  query {
    user(login: "copilot") {
      id
    }
  }
' --jq '.data. user.id' 2>/dev/null || echo "")

# If user lookup fails, try bot lookup
if [ -z "$COPILOT_ID" ]; then
  echo "Trying bot lookup..."
  # The Copilot coding agent might be identified differently
  # We'll mention @copilot in the issue body instead as a fallback
  echo "Could not find Copilot actor ID.  Adding @copilot mention to issue..."
  
  # Update issue to mention copilot
  gh issue comment "$ISSUE_NUMBER" --body "@copilot Please analyze this failure and create a fix."
  echo "Added @copilot mention to issue."
  exit 0
fi

# Step 4: Assign Copilot using GraphQL mutation
echo "Assigning Copilot to issue..."
gh api graphql -f query='
  mutation($issueId: ID!, $actorIds: [ID!]!) {
    replaceActorsForAssignable(input: {
      assignableId: $issueId,
      actorIds: $actorIds
    }) {
      assignable {
        ...  on Issue {
          id
          number
        }
      }
    }
  }
' -f issueId="$ISSUE_NODE_ID" -f actorIds="[\"$COPILOT_ID\"]"

echo "Successfully assigned Copilot to issue #$ISSUE_NUMBER!"
