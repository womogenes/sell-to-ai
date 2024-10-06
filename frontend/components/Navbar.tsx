import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="flex w-full items-center px-4 py-2">
      <Link
        className="font-black uppercase tracking-tight opacity-30 transition-all hover:opacity-100"
        href="/"
      >
        Sell to AI
      </Link>
      <Link
        className="ml-auto opacity-30 transition-all hover:opacity-100"
        href="https://github.com/womogenes/sell-to-ai"
        target="_blank"
      >
        <GitHubLogoIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
