import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ArrowIcon, GithubIcon, SocialIcon, StarIcon } from "../components/Icons";

describe("icons", () => {
  it.each([
    ["star", <StarIcon key="s" />],
    ["arrow", <ArrowIcon key="a" />],
    ["github", <GithubIcon key="g" />],
    ...["facebook", "instagram", "twitter", "linkedin"].map((name) => [name, <SocialIcon key={name} name={name} />]),
  ])("%s renders a valid SVG path", (_, icon) => {
    const { container } = render(icon);
    expect(container.querySelector("path").getAttribute("d")).toMatch(/^M[\d.]/);
  });
});
