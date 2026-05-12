import Auth from "./auth";

export default function HomeLayout({ children }) {
  return (
    <Auth>
      <div>{children}</div>
    </Auth>
  );
}
