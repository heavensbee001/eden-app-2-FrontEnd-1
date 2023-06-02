import { gql } from "@apollo/client";

export const UPDATE_TALENT_LIST_WITH_TALENT = gql`
  mutation UpdateUsersTalentListPosition(
    $fields: updateUsersTalentListPositionInput
  ) {
    updateUsersTalentListPosition(fields: $fields) {
      _id
      name
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
