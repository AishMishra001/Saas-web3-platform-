import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          M
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/analytics" className="hover:text-gray-300">
            Analytics
          </Link>
          <Link to="/case-study" className="hover:text-gray-300">
            Case Study
          </Link>
          <Link to="/wallet" className="hover:text-gray-300">
            Wallet
          </Link>
          <Link to="/community" className="hover:text-gray-300">
            Community
          </Link>
          <Link to="/about" className="hover:text-gray-300">
            About
          </Link>
        </div>
        <button className="px-6 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          Connect
        </button>
      </nav>

      {/* Data Comparison Section */}
      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        {/* Left Data Block */}
        <div className="space-y-4">
          <p className="text-sm text-gray-400 max-w-sm">
            This is font Roboto which is considered much better and professional by about 93% people in the this wolrd
          </p>
          <h2 className="text-2xl font-bold">DATA</h2>
          <div className="bg-[#2B2B8F] p-12 rounded-lg flex items-center justify-center">
            <div className="w-full max-w-[200px]">
              <img
                src="/placeholder.svg?height=60&width=200"
                alt="Decathlon Logo"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Right Data Block */}
        <div className="space-y-4">
          <p className="text-sm text-gray-400 max-w-sm">
            This is font Montserrat which is a bit softer when it comes to conveying a more clear idea to your consumers around the world
          </p>
          <h2 className="text-2xl font-bold">DATA</h2>
          <div className="bg-[#0066FF] p-12 rounded-lg flex items-center justify-center">
            <div className="w-full max-w-[200px]">
              <img
                src="/placeholder.svg?height=60&width=200"
                alt="Decathlon Logo"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Connect Wallet Section */}
      <section className="container mx-auto px-4 py-12 relative">
        <div className="absolute top-4 left-4 text-sm text-gray-400">Frame 31</div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-70"></div>
          <div className="relative text-center space-y-6 py-20">
            <h2 className="text-4xl md:text-6xl font-bold">
              Connect your<br />Wallet now
            </h2>
            <p className="text-gray-300 max-w-md mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vitae dictum lectus. Fusce sapien tortor, scelerisq
            </p>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Try clicking any one and<br />find one why it's right or wrong
          </p>
        </div>
      </section>

      {/* New Section Below */}
      <section className="container mx-auto px-4 py-16 relative bg-transparent">
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-20 mb-24">
          {/* Marketplace */}
          <div className="space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gray-700 rounded-full">
                <div className="absolute -right-1 -top-1 w-6 h-6 bg-yellow-500 rounded-full" />
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">👍</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">Marketplace</h3>
            <p className="text-gray-400 max-w-sm">
              Set to operate a next-gen decentralized exchange, swapping digital assets from across the
              Interchain, with very low fees and instant transaction confirmation.
            </p>
          </div>

          {/* Security Provider */}
          <div className="space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7V11C2 16.55 6.84 21.74 12 22C17.16 21.74 22 16.55 22 11V7L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">Security provider</h3>
            <p className="text-gray-400 max-w-sm">
              With the upcoming Interchain Security feature, HEDRON will soon be securing many chains, in
              exchange for additional staking rewards.
            </p>
          </div>

          {/* Router */}
          <div className="space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gray-700 rounded-full overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-yellow-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">Router</h3>
            <p className="text-gray-400 max-w-sm">
              A core mission of the Hub – to connect chains by establishing IBC connections with
              compatible chains and operating decentralized bridges with chains like Ethereum and
              Bitcoin.
            </p>
          </div>

          {/* Custodian */}
          <div className="space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full transform rotate-45" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">Custodian</h3>
            <p className="text-gray-400 max-w-sm">
              Located at the crossroads of the Interchain, the Hub is extremely secure, the best place to
              hold digital assets and manage accounts across many chains.
            </p>
          </div>
        </div>

        {/* Frame 21 and Button */}
        <div className="text-center space-y-6">
          <div className="text-sm text-gray-400">Frame 21</div>
          <button
            className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full flex items-center gap-2"
          >
            Cosmos Hub
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Payment Text */}
        <div className="absolute bottom-0 left-0 right-0">
          <div
            className="text-[160px] font-bold text-transparent tracking-wider"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.1)",
              lineHeight: "1",
            }}
          >
            PAYMENT
          </div>
        </div>
      </section>
    </div>
  );
}
