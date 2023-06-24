import { gql } from "@apollo/client";

// import { PositionCandidatesFragment } from "../fragments/positionCandidatesFragment";

export const FIND_POSITION_LIGHT = gql`
  query ($fields: findPositionInput!) {
    findPosition(fields: $fields) {
      _id
      name
      candidates {
        overallScore
        skillScore
        conversationID
        user {
          _id
          discordName
          discordAvatar
          timeZone
          location
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
          originalQuestionContent
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
        compareCandidatePosition {
          CV_ConvoToPositionAverageScore
          CV_ConvoToPosition {
            categoryName
            score
            reason
          }
          reportPassFail {
            categoryName
            title
            score
            reason
            IDb
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
    }
  }
`;
// ${PositionCandidatesFragment}
