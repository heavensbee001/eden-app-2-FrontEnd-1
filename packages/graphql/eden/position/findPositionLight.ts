import { gql } from "@apollo/client";

// import { PositionCandidatesFragment } from "../fragments/positionCandidatesFragment";

export const FIND_POSITION_LIGHT = gql`
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
          budget {
            perHour
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
      candidatesReadyToDisplay
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
      notesInterview {
        categoryName
        score
        reason
      }
    }
  }
`;
// ${PositionCandidatesFragment}
