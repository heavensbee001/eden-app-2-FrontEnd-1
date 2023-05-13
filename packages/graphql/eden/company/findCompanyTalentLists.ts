import { gql } from "@apollo/client";

export const FIND_COMPANY_TALENT_LISTS = gql`
  query FindCompanyTalentLists($fields: findCompanyInput) {
    findCompany(fields: $fields) {
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
