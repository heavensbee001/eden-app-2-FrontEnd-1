import { gql } from "@apollo/client";

export const FIND_AVAILABLE_MEMBERS = gql`
  query FindMembers($fields: findMembersInput) {
    findMembers(fields: $fields) {
      _id
      discordName
    }
  }
`;
