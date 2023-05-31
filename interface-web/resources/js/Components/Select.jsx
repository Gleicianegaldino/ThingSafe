export default function Select({ className = '', children, ...props }) {
    return (
      <select
        {...props}
        className={
          'rounded border-gray-300 text-black shadow-sm focus:ring-indigo-500 ' +
          className
        }
      >
        {children}
      </select>
    );
  }
  