import { gql } from "@apollo/client";

// import { PositionCandidatesFragment } from "../fragments/positionCandidatesFragment";

export const FIND_POSITION_FULL = gql`
  query ($fields: findPositionInput!) {
    findPosition(fields: $fields) {
      _id
      name
      candidates {
        overallScore
        user {
          _id
          discordName
          discordAvatar
          timeZone
          location
          memberRole {
            _id
            title
          }
          budget {
            perHour
          }
          nodes {
            nodeData {
              _id
              name
              node
            }
          }
          previousProjects {
            title
            positionName
          }
          experienceLevel {
            total
            years
          }
        }
        readyToDisplay
        summaryQuestions {
          questionID
          questionContent
          questionContentSmall
          answerContent
          answerContentSmall
          reason
          score
          bestAnswerPosition
          subConversationAnswer {
            role
            content
          }
        }
        notesInterview {
          categoryName
          score
          reason
        }
      }
      talentList {
        _id
        name
        talent {
          user {
            _id
            discordName
            discordAvatar
            memberRole {
              _id
              title
            }
            budget {
              perHour
            }
            experienceLevel {
              total
              years
            }
          }
        }
      }
      nodes {
        nodeData {
          _id
          name
        }
      }
      candidatesReadyToDisplay
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
    }
  }
`;
// ${PositionCandidatesFragment}
