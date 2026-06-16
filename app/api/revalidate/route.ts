import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let paths = ["/"];
  let refreshLayout = true;

  try {
    const body = await request.json();

    if (Array.isArray(body.paths)) {
      paths = body.paths.filter(
        (path: unknown): path is string =>
          typeof path === "string" && path.startsWith("/")
      );
    } else if (typeof body.path === "string" && body.path.startsWith("/")) {
      paths = [body.path];
    }

    if (body.layout === false) {
      refreshLayout = false;
    }
  } catch {
    // Use defaults.
  }

  if (paths.length === 0) {
    paths = ["/"];
  }

  const uniquePaths = [...new Set(paths)];

  for (const path of uniquePaths) {
    revalidatePath(path);
  }

  if (refreshLayout) {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({
    revalidated: true,
    paths: uniquePaths,
    layout: refreshLayout,
  });
}
