import fs from "fs";
import matter from "gray-matter";
import renderToString from "next-mdx-remote/render-to-string";
import { MdxRemote } from "next-mdx-remote/types";
import { join } from "path";
import { DateTime } from "luxon";

const postsDirectory = join(process.cwd(), "_posts");

export const parseFilename = (filename: string): string => filename.replace(/\.mdx$/, "");

export const getFilename = (slug: string): string => `${slug}.mdx`;

export const getPostSlugs = (): string[] => fs.readdirSync(postsDirectory).map(parseFilename);

export interface PostData {
  title: string;
  publishedAt: string;
  slug: string;
  excerpt: string;
  images: string[];
}

export interface Post {
  mdxSource: MdxRemote.Source;
  data: PostData;
}

export interface PostMarkdown {
  content: string;
  data: PostData;
}

export const readPostMarkdown = (slug: string): PostMarkdown => {
  const path = join(postsDirectory, getFilename(slug));
  const fileContents = fs.readFileSync(path, "utf8");
  const { content, data } = matter(fileContents);

  const mdImageRexExp = /!\[[^\]]*\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/g;

  const imageMatches = Array.from(content.matchAll(mdImageRexExp));

  const images = imageMatches.map((match) => match[1]);

  return {
    content,
    data: {
      slug,
      title: data.title,
      publishedAt: data.publishedAt.toISOString(),
      excerpt: data.excerpt,
      images,
    },
  };
};

export const getPosts = (): PostData[] => {
  const slugs = getPostSlugs();

  return slugs
    .map((slug) => readPostMarkdown(slug).data)
    .sort((a, b) => DateTime.fromISO(b.publishedAt).toMillis()
    - DateTime.fromISO(a.publishedAt).toMillis());
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const { content, data } = readPostMarkdown(slug);
  const mdxSource = await renderToString(content);

  return {
    mdxSource,
    data,
  };
};
