import { gql } from "@apollo/client";

export const INTERVIEW_EDEN_AI = gql`
  query ($fields: interviewEdenAIInput!) {
    interviewEdenAI(fields: $fields) {
      reply
      date
      conversationID
      questionAskingNow
      unansweredQuestionsArr {
        questionContent
        questionID
      }
      timesAsked
    }
  }
`;

export const MESSAGE_MAP_KG_V4 = gql`
  query ($fields: messageMapKG_V4Input!) {
    messageMapKG_V4(fields: $fields) {
      keywords {
        keyword
        confidence
        nodeID
        node {
          _id
          name
          node
          categoryNodes {
            name
          }
          groupNodes {
            name
          }
        }
      }
    }
  }
`;
