// import { UserContext } from "@eden/package-context";
import { gql, useMutation } from "@apollo/client";
import { CompanyContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import { Avatar, Button, SaasUserLayout } from "@eden/package-ui";
import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";
import { useContext } from "react";
import { toast } from "react-toastify";

// import { useContext } from "react";
import type { NextPageWithLayout } from "../../../_app";

const ADD_EMPLOYEES_COMPANY = gql`
  mutation ($fields: addEmployeesCompanyInput!) {
    addEmployeesCompany(fields: $fields) {
      _id
      name
      slug
      employees {
        typeT
        user {
          _id
          discordName
        }
      }
    }
  }
`;

const PendingRequestsPage: NextPageWithLayout = () => {
  const { company } = useContext(CompanyContext);

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onError() {
      toast.error("An error occurred while updating user");
    },
  });

  const handleAcceptEmployee = (employeeID: string) => {
    addEmployeesCompany({
      variables: {
        fields: {
          companyID: company?._id,
          employees: [
            { typeT: "EMPLOYEE", status: "ACTIVE", userID: employeeID },
          ] as EmployeeTypeInput[],
        },
      },
    });
  };

  const handleRejectEmployee = (employeeID: string) => {
    addEmployeesCompany({
      variables: {
        fields: {
          companyID: company?._id,
          employees: [
            { typeT: "EMPLOYEE", status: "REJECTED", userID: employeeID },
          ] as EmployeeTypeInput[],
        },
      },
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-edenGreen-600 mb-4">
        {company?.name} pending employee access requests:
      </h1>
      {company &&
        company
          ?.employees!.filter((employee) => employee?.status === "PENDING")
          .map((employee, index) => (
            <div
              key={index}
              className="flex items-center bg-edenPink-300 px-4 py-2 w-[20rem] mb-2 rounded-md"
            >
              <div className="h-8">
                <Avatar
                  src={employee?.user?.discordAvatar as string}
                  size="xs"
                />
              </div>
              <h3 className="ml-2">{employee?.user?.discordName}</h3>
              <Button
                onClick={() => handleAcceptEmployee(employee?.user?._id!)}
                className="text-sm !px-2 !py-1 mr-2 ml-auto"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleRejectEmployee(employee?.user?._id!)}
                className="text-sm !px-2 !py-1 text-utilityRed border-utilityRed hover:bg-utilityRed hover:border-utilityRed hover:text-white"
              >
                Reject
              </Button>
            </div>
          ))}
    </div>
  );
};

PendingRequestsPage.getLayout = (page) => (
  <SaasUserLayout>{page}</SaasUserLayout>
);

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5) {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session.user!.id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${ctx.query.slug}`,
        permanent: false,
      },
    };
  }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default PendingRequestsPage;
