import { DateTime } from "luxon";
import { NextApiHandler } from "next";
import { Monitor } from "../../lib/status";

const { HETRIXTOOLS_API_KEY } = process.env;

interface HetrixMonitor {
  id: string;
  name: string;
  category: string;
  uptime_status: string;
  monitor_status: string;
  last_check: number;
  last_status_change: number;
  public_report: boolean;

  /**
   * Uptime (percentage; 0-100).
   */
  uptime: number;
}

const getStatus: NextApiHandler = async (req, res) => {
  const r = await fetch("https://api.hetrixtools.com/v3/uptime-monitors", {
    headers: { authorization: `Bearer ${HETRIXTOOLS_API_KEY}` },
  });

  if (!r.ok) {
    res.status(503);
    return res.end();
  }

  const data: { monitors: HetrixMonitor[] } = await r.json();

  const monitors: Monitor[] = data.monitors
    .filter((m) => m.public_report)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((m) => ({
      name: m.name,
      id: m.id,
      category: !m.category ? null : m.category,
      online: m.uptime_status === "up",
      maintenance: m.monitor_status === "maint",
      lastCheck: DateTime.fromSeconds(m.last_check).toUTC().toISO(),
      lastStatusChange: DateTime.fromSeconds(m.last_status_change)
        .toUTC()
        .toISO(),
      uptime: m.uptime / 100,
    }));

  res.setHeader("cache-control", "public, max-age=60");

  return res.json(monitors);
};

export default getStatus;
