import { gql } from "@apollo/client";

export const FIND_CONVERSATIONS = gql`
  query FindConversations($fields: findConversationsInput) {
    findConversations(fields: $fields) {
      _id
      userID
      positionID
      conversation {
        role
        content
        date
      }
    }
  }
`;
