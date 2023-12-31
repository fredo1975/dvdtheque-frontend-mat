import { environment } from "src/environments/environment";
import { ConfigInitService } from "./config-init.service";
import { RxStompService } from "./rx-stomp.service";

export function initializeRxStompService(configService: ConfigInitService) {
    const rxStomp = new RxStompService();
    
    //let rxStompConfig: any
    /*
    configService.getConfig()
      .pipe(
        switchMap<any, any>((config) => {
            //rxStompConfig = from(rxStompConfig={brokerURL: config['WS_BROKER_URL']})
            //console.log('rxStompConfig',config['WS_BROKER_URL'])
            return
        })
      )*/
      
    const rxStompConfig: any = {
        brokerURL: environment.websocketApiUrl,
        // Headers
        // Typical keys: login, passcode, host
        connectHeaders: {
            login: 'guest',
            passcode: 'guest',
        },

        // How often to heartbeat?
        // Interval in milliseconds, set to 0 to disable
        heartbeatIncoming: 0, // Typical value 0 - disabled
        heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

        // Wait in milliseconds before attempting auto reconnect
        // Set to 0 to disable
        // Typical value 500 (500 milli seconds)
        reconnectDelay: 0,

        // Will log diagnostics on console
        // It can be quite verbose, not recommended in production
        // Skip this key to stop logging to console
        /*
        debug: (msg: string): void => {
            console.log(new Date(), msg);
        },*/
    }
    rxStomp.configure(rxStompConfig);
    rxStomp.activate()
    return rxStomp

    /*
    configService.getConfig()
            .subscribe({
                next: (data: any) => {
                    console.log(data)
                    rxStompConfig = {
                        brokerURL: data['WS_BROKER_URL'],
                        // Headers
                        // Typical keys: login, passcode, host
                        connectHeaders: {
                            login: 'guest',
                            passcode: 'guest',
                        },

                        // How often to heartbeat?
                        // Interval in milliseconds, set to 0 to disable
                        heartbeatIncoming: 0, // Typical value 0 - disabled
                        heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

                        // Wait in milliseconds before attempting auto reconnect
                        // Set to 0 to disable
                        // Typical value 500 (500 milli seconds)
                        reconnectDelay: 200,

                        // Will log diagnostics on console
                        // It can be quite verbose, not recommended in production
                        // Skip this key to stop logging to console
                        debug: (msg: string): void => {
                            console.log(new Date(), msg);
                        },
                    }
                },
                error: (e) => {
                    console.log(e)
                },
                complete: () => {
                    console.info('complete')
                    rxStomp.activate()
                }
            })
   return () => {
    rxStomp
   }*/
}