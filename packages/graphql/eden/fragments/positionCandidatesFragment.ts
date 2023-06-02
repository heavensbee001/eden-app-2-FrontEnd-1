import { gql } from "@apollo/client";

export const PositionCandidatesFragment = gql`
  fragment PositionCandidatesFragment on Project {
    candidates {
      overallScore
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
        answerContent
        reason
        score
        bestAnswerPosition
      }
    }
  }
`;
