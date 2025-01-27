import { ICurrentConfines } from '../types';
import { LOG_LEVELS } from '../types';
import breakpointHandler from '../utils/breakpointHandler';
import dispatchEvent from '../utils/dispatchEvent';
import isBetween from '../utils/isBetween';
import throttle from '../utils/throttle';
import GenericPlugin from './GenericPlugin';

class Responsive extends GenericPlugin {
  public currentConfines: ICurrentConfines = {};
  private EVENT_KEY: string = 'resize';
  private THROTTLE_DURATION: number = 250;
  private listener?: any;

  public beforeCreate() {
    if (this.isRefreshDisabled()) {
      dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Responsive Plugin', `Ad refresh is disabled.`);

      return;
    }

    this.determineCurrentBreakpoint();

    this.listener = () => {
      throttle(() => {
        const { from = 0, to = 1 } = this.currentConfines;

        if (isBetween(window.innerWidth, from, to)) {
          return;
        }

        this.determineCurrentBreakpoint();

        dispatchEvent(
          this.ad.id,
          LOG_LEVELS.INFO,
          'Responsive Plugin',
          `Viewport dimensions have entered a new breakpoint. Calling refresh.`,
        );

        this.ad.refresh();
      }, this.THROTTLE_DURATION);
    };

    window.addEventListener(this.EVENT_KEY, this.listener);
  }

  public beforeClear() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Responsive Plugin', `Removing window resize listener for ad.`);
    window.removeEventListener(this.EVENT_KEY, this.listener);
  }

  public beforeDestroy() {
    dispatchEvent(this.ad.id, LOG_LEVELS.INFO, 'Responsive Plugin', `Removing window resize listener for ad.`);
    window.removeEventListener(this.EVENT_KEY, this.listener);
  }

  public determineCurrentBreakpoint() {
    const { sizes = [], breakpoints } = this.ad.configuration;
    this.currentConfines = breakpointHandler(sizes, breakpoints);
  }

  public isRefreshDisabled() {
    const { configuration } = this.ad;
    return (configuration.hasOwnProperty('refreshOnBreakpoint') && !configuration.refreshOnBreakpoint);
  }
}

export default Responsive;
