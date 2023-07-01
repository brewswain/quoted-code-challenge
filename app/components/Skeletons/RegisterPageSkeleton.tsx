const RegisterPageSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-[90vw] m-0 m-auto mt-24">
      <div className="animate-pulse w-9/12">
        <div className="w-full h-8 mb-12 bg-gray-300 rounded"></div>
      </div>
      <div className="flex items-end  flex-col justify-center py-4 w-9/12 animate-pulse">
        <div className="w-full h-8 mb-6 bg-gray-300 rounded"></div>
        <div className="w-full h-9 mb-6  bg-gray-300 rounded"></div>
        <div className="w-full h-9 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default RegisterPageSkeleton;
