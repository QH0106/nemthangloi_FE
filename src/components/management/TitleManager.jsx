import { useEffect, useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { NAVBAR_ITEMS } from "../../constants/common.constants";

const BRAND = "Nệm Thắng Lợi";



function flattenNav(items) {
  return items.flatMap((it) => [
    it,
    ...(it.children ? flattenNav(it.children) : []),
  ]);
}

function buildTitleMap(items) {
  const flat = flattenNav(items);
  return flat.map((it) => {
    const isHome = it.link === "/";
    const pageTitle = isHome ? `Trang chủ - ${BRAND}` : `${it.title} - ${BRAND}`;
    return { pattern: it.link, title: pageTitle };
  });
}

export default function TitleManager() {
  const { pathname } = useLocation();

  const routes = useMemo(
    () => buildTitleMap(NAVBAR_ITEMS),
    []
  );

  useEffect(() => {
    const matched = routes.find((r) =>
      matchPath({ path: r.pattern, end: true }, pathname)
    );
    document.title = matched?.title ?? BRAND;
  }, [pathname, routes]);

  return null;
}
