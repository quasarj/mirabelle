import React from "react";
import { useLoaderData } from "react-router-dom";
import MainPanel from "../../components/MainPanel.jsx";
import { Context } from "../../components/Context";
import useConfigState from "../../hooks/useConfigState";
import { getDetails } from "../../masking.js";
import { getFiles, getIECInfo } from "../../utilities";
import { TASK_CONFIGS } from "../../config/config";

import ReviewIEC, { loader as iecLoader } from "./review";
import { getNextIECForVRReview } from "../../utilities";

export async function loader({ params }) {
  console.log(params);

  const iec = await getNextIECForVRReview(params.visual_review_instance_id);

  // inject it into the params that came from the route
  params.iec = iec;

  const other = await iecLoader({ params });

  return other;
}

export default function RouteMaskReviewVR() {
  return <ReviewIEC forcenav={true} />;
}
