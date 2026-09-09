import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------- 先 mock auth-context（hoisted） ----------
const mockSignOut = vi.fn();

let mockUser: { name: string; email: string } | null = null;
let mockLoading = false;

vi.mock("@/components/auth/auth-context", () => ({
  useAuth: () => ({
    user: mockUser,
    loading: mockLoading,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: mockSignOut,
  }),
}));

// ----------被测组件 ----------
import { SiteHeader } from "@/components/site-header";

function renderHeader() {
  return render(<SiteHeader />);
}

describe("SiteHeader", () => {
  beforeEach(() => {
    mockUser = null;
    mockLoading = false;
    mockSignOut.mockReset();
  });

  describe("主导航（桌面端 md+）", () => {
    it("4 个产品入口直接露出：八字/塔罗/紫微/AI 问答", () => {
      renderHeader();

      const nav = screen.getByRole("navigation", { name: /主导航/ });
      const links = nav.querySelectorAll("a");

      expect(links).toHaveLength(4);
      expect(links[0]).toHaveAttribute("href", "/fortune/bazi");
      expect(links[0]).toHaveTextContent("八字");
      expect(links[1]).toHaveAttribute("href", "/fortune/tarot");
      expect(links[1]).toHaveTextContent("塔罗");
      expect(links[2]).toHaveAttribute("href", "/fortune/ziwei");
      expect(links[2]).toHaveTextContent("紫微");
      expect(links[3]).toHaveAttribute("href", "/ask");
      expect(links[3]).toHaveTextContent("AI 问答");
    });
  });

  describe("未登录状态", () => {
    it("显示用户图标按钮（账户入口）", () => {
      mockUser = null;
      mockLoading = false;
      renderHeader();

      expect(screen.getByRole("button", { name: "账户" })).toBeInTheDocument();
    });

    it("点击用户图标展开下拉，显示登录和注册入口", async () => {
      const user = userEvent.setup();
      mockUser = null;
      mockLoading = false;
      renderHeader();

      const accountBtn = screen.getByRole("button", { name: "账户" });
      await user.click(accountBtn);

      const loginLink = screen.getByRole("link", { name: "登录" });
      const signupLink = screen.getByRole("link", { name: "注册" });

      expect(loginLink).toHaveAttribute("href", "/login");
      expect(signupLink).toHaveAttribute("href", "/signup");
    });

    it("点击遮罩关闭下拉菜单", async () => {
      const user = userEvent.setup();
      mockUser = null;
      mockLoading = false;
      renderHeader();

      const accountBtn = screen.getByRole("button", { name: "账户" });
      await user.click(accountBtn);
      expect(screen.getByRole("link", { name: "登录" })).toBeInTheDocument();

      // 遮罩：aria-hidden + fixed inset
      const overlay = document.querySelector(
        "button[aria-hidden='true'].fixed.inset-0"
      );
      expect(overlay).not.toBeNull();
      await user.click(overlay as Element);

      expect(screen.queryByRole("link", { name: "登录" })).not.toBeInTheDocument();
    });
  });

  describe("已登录状态", () => {
    const fakeUser = { name: "测试用户", email: "test@example.com" };

    it("显示用户名（通过下拉触发按钮）", () => {
      mockUser = fakeUser;
      mockLoading = false;
      renderHeader();

      expect(screen.getByText("测试用户")).toBeInTheDocument();
      // 不应显示未登录的账户图标
      expect(screen.queryByRole("button", { name: "账户" })).not.toBeInTheDocument();
    });

    it("点击头像展开下拉，含用户信息 + 我的档案 + 退出登录", async () => {
      const user = userEvent.setup();
      mockUser = fakeUser;
      mockLoading = false;
      renderHeader();

      const avatarBtn = screen
        .getAllByRole("button")
        .find((b) => b.textContent?.includes("测试用户"));
      expect(avatarBtn).toBeDefined();
      await user.click(avatarBtn as Element);

      // 下拉里有用户邮箱（唯一）
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      // 「我的档案」链接
      expect(screen.getByRole("link", { name: "我的档案" })).toHaveAttribute(
        "href",
        "/profile"
      );
      // 退出登录按钮
      expect(
        screen.getByRole("button", { name: "退出登录" })
      ).toBeInTheDocument();
    });

    it("点击退出登录调用 signOut", async () => {
      const user = userEvent.setup();
      mockUser = fakeUser;
      mockLoading = false;
      renderHeader();

      const avatarBtn = screen
        .getAllByRole("button")
        .find((b) => b.textContent?.includes("测试用户"));
      await user.click(avatarBtn as Element);

      await user.click(screen.getByRole("button", { name: "退出登录" }));

      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe("加载状态", () => {
    it("loading=true 时右侧不渲染用户入口按钮", () => {
      mockUser = null;
      mockLoading = true;
      renderHeader();

      expect(screen.queryByRole("button", { name: "账户" })).not.toBeInTheDocument();
    });
  });
});
