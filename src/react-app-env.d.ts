/// <reference types="react-scripts" />

declare module 'velocity-animate' {
  import Velocity from 'velocity-animate';
  export default Velocity;
}

declare module 'velocity-react' {
  import VelocityReact from 'velocity-react';
  export default VelocityReact;
}

declare module 'comma-separated-values' {
  import CSV from 'comma-separated-values';
  export default CSV;
}

declare interface File {
  webkitRelativePath: string;
}
