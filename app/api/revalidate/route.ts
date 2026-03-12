import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST() {
  revalidateTag("prismic", "max");

  try {
    // Pages
    revalidatePath("/blog");
    revalidatePath("/blog/[uid]", "page");
    // Sitemap.xml
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: `Error revalidating: ${err}` }, { status: 500 });
  }
}
