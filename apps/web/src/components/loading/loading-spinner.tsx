export default function LoadingSpinner() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <svg
        className="loading-stroke"
        fill="hsl(var(--primary-app-color) / 0.1)"
        height="120"
        viewBox="0 0 102 120"
        width="102"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.5293 20.8154C22.4515 19.5061 26.5 22.4303 26.5 26.5684V68.9248C26.5003 82.4772 37.4699 93.4619 51 93.4619C64.5301 93.4619 75.4997 82.4772 75.5 68.9248V35.7949C75.5001 33.1854 77.1677 30.8676 79.6406 30.042L93.5293 25.4062C97.4514 24.0969 101.5 27.0203 101.5 31.1582V68.9248C101.5 96.7823 78.8914 119.5 51 119.5C23.1091 119.5 0.500263 96.856 0.5 68.9248V31.2051C0.5 28.5955 2.16761 26.2777 4.64062 25.4521L18.5293 20.8154Z"
          stroke="hsl(var(--primary-app-color))"
        />
        <path
          d="M93.5859 0.798828C97.5028 -0.476209 101.5 2.47716 101.5 6.61719V11.7051C101.5 14.3328 99.8356 16.6704 97.3613 17.5039L83.4717 22.1816C79.5434 23.5044 75.5002 20.5484 75.5 16.3828V11.1387C75.5001 8.48826 77.1932 6.1365 79.6973 5.32129L93.5859 0.798828Z"
          stroke="hsl(var(--primary-app-color))"
        />
      </svg>
      <p className="text-primary loading-text mt-4 font-medium">Loading...</p>
    </div>
  );
}
