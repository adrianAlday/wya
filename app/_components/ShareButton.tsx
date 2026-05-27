"use client";

type ShareButtonProps = { host: string };

const ShareButton = ({ host }: ShareButtonProps) => {
  const getUrl = () =>
    typeof window === "undefined" ? host : window.location.href;

  return (
    <div className="my-4">
      <button
        onClick={async () => {
          const url = getUrl();
          const title = new URL(url)?.searchParams.get("t") || url;

          navigator.clipboard.writeText(url);

          try {
            await navigator.share({ url, title });
          } catch (error: unknown) {
            console.log(error);
          }
        }}
        className="cursor-pointer w-full"
      >
        <div
          className={`border border-[#3d444d] rounded-md text-xs bg-[#212830] hover:bg-[rgb(39,44,53)] active:bg-[rgb(42,49,59)] transition-colors py-1 flex items-center justify-center font-medium`}
        >
          <div>Share</div>
        </div>
      </button>
    </div>
  );
};

export default ShareButton;
