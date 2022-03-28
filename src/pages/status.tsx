import { NextPage } from "next";
import React, { FunctionComponent } from "react";
import useSWR from "swr";
import Layout from "../components/Layout";
import { Monitor } from "../lib/status";

const StatusText: FunctionComponent<{ online: boolean; maintenance: boolean }> =
  ({ online, maintenance }) => {
    let text = "Down";

    if (online) {
      if (maintenance) {
        text = "Under maintenance";
      } else {
        text = "Operational";
      }
    } else if (maintenance) {
      text = "Down for maintenance";
    }

    let color = "error";

    if (online) {
      color = "text-primary";

      if (maintenance) {
        color = "warning";
      }
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
  const { data } = useSWR<Monitor[]>("/api/status", (path) =>
    fetch(path).then((res) => res.json()),
  );

  return (
    <Layout title="Status" description="Service status.">
      <table>
        <tbody>
          {data?.map((m) => (
            <tr key={m.id}>
              <td>
                <span className="category">{m.category}</span> / {m.name}
              </td>
              <td align="right">
                <StatusText online={m.online} maintenance={m.maintenance} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
