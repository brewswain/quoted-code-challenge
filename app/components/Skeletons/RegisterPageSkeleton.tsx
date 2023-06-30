const RegisterPageSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-[90vw] m-0 m-auto mt-20">
      <div className="animate-pulse">
        <div className="w-40 h-6 mb-4 bg-gray-300 rounded"></div>
        <div className="w-full h-6 mb-2 bg-gray-300 rounded"></div>
        <div className="w-full h-6 mb-2 bg-gray-300 rounded"></div>
        <div className="w-full h-6 mb-2 bg-gray-300 rounded"></div>
        <div className="w-full h-6 mb-2 bg-gray-300 rounded"></div>
      </div>
      <div className="flex items-end justify-center py-4 w-9/12">
        <div className="w-full h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default RegisterPageSkeleton;
