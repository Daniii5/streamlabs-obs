import {
  IWidgetData,
  IWidgetSettings,
  WidgetDefinitions,
  WidgetSettingsService,
  WidgetType,
} from 'services/widgets';
import { WIDGET_INITIAL_STATE } from './widget-settings';
import { InheritMutations } from 'services/core/stateful-service';

interface IEmoteWallSettings extends IWidgetSettings {
  background_color: string;
  font: string;
  font_color: string;
  font_size: string;
  font_weight: number;
  twitch: boolean;
  youtube: boolean;
  mixer: boolean;
}

export interface IEmoteWallData extends IWidgetData {
  settings: IEmoteWallSettings;
}

@InheritMutations()
export class EmoteWallService extends WidgetSettingsService<IEmoteWallData> {
  static initialState = WIDGET_INITIAL_STATE;

  getApiSettings() {
    return {
      type: WidgetType.EmoteWall,
      url: WidgetDefinitions[WidgetType.EmoteWall].url(this.getHost(), this.getWidgetToken()),
      previewUrl: `https://${this.getHost()}/widgets/emote-wall?token=${this.getWidgetToken()}&simulate=1`,
      dataFetchUrl: `https://${this.getHost()}/api/v5/slobs/widget/viewercount`,
      settingsSaveUrl: `https://${this.getHost()}/api/v5/slobs/widget/viewercount`,
      settingsUpdateEvent: 'emoteWallSettingsUpdate',
      customCodeAllowed: false,
      customFieldsAllowed: false,
    };
  }

  patchAfterFetch(data: any): IEmoteWallData {
    // transform platform types to simple booleans
    return {
      ...data,
      settings: {
        ...data.settings,
        twitch: data.settings.types.twitch.enabled,
        youtube: data.settings.types.youtube.enabled,
        mixer: data.settings.types.mixer.enabled,
      },
    };
  }

  patchBeforeSend(settings: IEmoteWallSettings): any {
    // the API accepts an object instead of simple booleans for platforms
    return {
      ...settings,
      types: {
        youtube: { enabled: settings.youtube },
        mixer: { enabled: settings.mixer },
        twitch: { enabled: settings.twitch },
      },
    };
  }
}