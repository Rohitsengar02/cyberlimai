// TypeScript module declaration for dynamic CDN import of TubesCursor

declare module "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js" {
  const TubesCursorFactory: (
    container: HTMLCanvasElement,
    options?: any
  ) => any;
  export default TubesCursorFactory;
}
