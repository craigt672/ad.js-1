import { IAd, IPlugin } from '../types';

class GenericPlugin implements IPlugin {
  protected ad: IAd;

  get name(): string {
    return this.constructor.name;
  }

  constructor(ad: IAd) {
    if (!ad) {
      throw new Error(`
        An ad must be pased into the Generic Plugin class. If your Plugin inherits from Generic Plugin
        and overrides the constructor make sure you are calling "super" and that you are passing in an
        instance of an ad as the first parameter. Alternatively, you can hook into the onCreate method
        which gets called by the constructor.

        Example:
          class ExamplePlugin extends GenericPlugin {
            onCreate() {
              console.log('Example Plugin Started Succesfully');
            }
          }

          // Or

          class ExamplePlugin extends GenericPlugin {
            constructor(ad) {
              super(ad);

              console.log('Example Plugin Started Succesfully');
            }
          }
      `);
    }

    this.ad = ad;
  }
}

export default GenericPlugin;