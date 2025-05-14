import Image from 'next/image';

const Header = () => {
  return (
    <div
      className="h-[126px] bg-cover bg-center flex items-center bg-gray-800"
      style={{ backgroundImage: "url('/header-bg.jpg')" }}
    >
      <div className="flex items-center justify-between w-full  mx-[192px]">
        <div className="flex items-center justify-between w-full">
          <Image src="/credilinq_logo.svg" alt="credilinq" width={134} height={78} />
          <h1 className="text-white text-sm md:text-[28px] font-medium ">
            SME HealthCheck - Get Started
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
