import { gql } from "@apollo/client";

export const FIND_POSITION_TALENT_LISTS = gql`
  query FindPositionTalentLists($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      name
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
    }
  }
`;
