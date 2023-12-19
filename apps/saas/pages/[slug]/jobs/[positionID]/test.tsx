import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { Position } from "@eden/package-graphql/generated";
import { Missing404Section, SEOProfile } from "@eden/package-ui";
import type { GetServerSideProps } from "next";

const ProfilePage = ({
  position,
  error,
}: {
  position: Position;
  error: string;
}) => {
  if (error) return <Missing404Section />;

  return (
    <>
      <SEOProfile
        handle={position.company?.name || ""}
        image={position.company?.imageUrl || ""}
        role={position.name || ""}
      />
      <div>{`${position.name} @ ${position.company?.name}`}</div>
    </>
  );
};

export default ProfilePage;

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { positionID } = context.query;

  try {
    const { data } = await client.query({
      query: gql`
        query ($fields: findPositionInput!) {
          findPosition(fields: $fields) {
            _id
            name
            status
            whoYouAre
            whatTheJobInvolves
            company {
              _id
              name
              slug
              imageUrl
              description
              benefits
              employeesNumber
              tags
              whatsToLove
              mission
              insights {
                letter
                text
              }
              edenTake
              funding {
                name
                date
                amount
              }
              culture {
                tags
                description
              }
              benefits
              values
              founders
              glassdoor
            }
            generalDetails {
              yearlySalary {
                min
                max
              }
              contractType
              officePolicy
              officeLocation
            }
          }
        }
      `,
      variables: {
        fields: {
          _id: positionID,
        },
      },
    });

    return {
      props: {
        position: data.findPosition,
        error: data.findPosition ? null : "Position not found",
      },
    };
  } catch (error) {
    return {
      props: {
        position: null,
        error: "Position not found",
      },
    };
  }
};
