import { gql } from "@apollo/client";

export const CREATE_NEW_TALENT_LIST = gql`
  mutation CreateTalentListPosition($fields: createTalentListPositionInput) {
    createTalentListPosition(fields: $fields) {
      _id
      talentList {
        _id
        name
        talent {
          user {
            _id
            discordName
          }
        }
      }
    }
  }
`;
