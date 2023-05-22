import { gql } from "@apollo/client";

import { PositionCandidatesFragment } from "../fragments/positionCandidatesFragment";

export const FIND_POSITION_CANDIDATES = gql`
  query ($fields: findPositionInput!) {
    findPosition(fields: $fields) {
      _id
      name
      ...PositionCandidatesFragment
    }
  }
  ${PositionCandidatesFragment}
`;
