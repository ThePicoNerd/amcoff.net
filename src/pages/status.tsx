import { NextPage } from "next";
import React, { FunctionComponent } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import Skeleton from "../components/Skeleton";
import { Monitor } from "../lib/status";

const StatusText: FunctionComponent<{ online: boolean; maintenance: boolean }> =
  ({ online, maintenance }) => {
    let text = "Outage";
    let color = "error";

    if (online) {
      color = "text-primary";

      if (maintenance) {
        text = "Under maintenance";
        color = "warning";
      } else {
        text = "Operational";
      }
    } else if (maintenance) {
      text = "Down for maintenance";
    }

    return (
      <>
        <span>{text}</span>
        <style jsx>{`
          span {
            font-weight: 500;
            color: var(--${color});
          }
        `}</style>
      </>
    );
  };

const Status: NextPage = () => {
  const { data, error, isValidating } = useSWR<Monitor[]>(
    "/api/status",
    (path) =>
      fetch(path).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return res.json();
      }),
  );

  return (
    <Layout title="Status" description="Service status.">
      {error && !isValidating ? (
        <p>An error occurred.</p>
      ) : (
        <table>
          <tbody>
            {(data ?? Array.from({ length: 5 }))?.map((m, i) => (
              <tr key={m?.id ?? i}>
                <td>
                  {m ? (
                    <>
                      <span className="category">{m.category}</span> / {m.name}
                    </>
                  ) : (
                    <Skeleton width="10em" />
                  )}
                </td>
                <td align="right">
                  {m ? (
                    <StatusText online={m.online} maintenance={m.maintenance} />
                  ) : (
                    <Skeleton width="6em" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        table {
          width: 100%;
        }

        td {
          padding: 12px 0;
        }

        .category {
          color: var(--text-secondary);
        }
      `}</style>
    </Layout>
  );
};

export default Status;
