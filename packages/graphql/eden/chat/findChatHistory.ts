import { gql } from "@apollo/client";

export const FIND_CHAT_HISTORY = gql`
  query FindLastNumMessagesChatExternalApp(
    $fields: findLastNumMessagesChatExternalAppInput
  ) {
    findLastNumMessagesChatExternalApp(fields: $fields) {
      _id
      chatID_TG
      timeStamp
      message
      senderRole
    }
  }
`;
