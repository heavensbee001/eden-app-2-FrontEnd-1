import { gql } from "@apollo/client";

export const FIND_TALENT_LIST = gql`
  query FindUserTalentListPosition($fields: findUserTalentListPositionInput) {
    findUserTalentListPosition(fields: $fields) {
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
  }
`;
