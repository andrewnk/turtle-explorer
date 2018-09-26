import outdent from 'outdent'

export default [
    {
        name: 'Xmr-Stak',
        os: [
            {
                name: 'Linux',
                command: ``,
                config: outdent `
                "pool_list": [
                    {
                        "pool_address": "%1$s:%2$s",
                        "wallet_address": "%3$s",
                        "rig_id": "",
                        "pool_password": "",
                        "use_nicehash": false,
                        "use_tls": false,
                        "tls_fingerprint": "",
                        "pool_weight": 1
                    },
                ],`
            },
            {
                name: 'Windows',
                command: ``,
                config: outdent `
                "pool_list": [
                    {
                        "pool_address": "%1$s:%2$s",
                        "wallet_address": "%3$s",
                        "rig_id": "",
                        "pool_password": "",
                        "use_nicehash": false,
                        "use_tls": false,
                        "tls_fingerprint": "",
                        "pool_weight": 1
                    },
                ],`
            },
            {
                name: 'Mac',
                command: ``,
                config: outdent `
                "pool_list": [
                    {
                        "pool_address": "%1$s:%2$s",
                        "wallet_address": "%3$s",
                        "rig_id": "",
                        "pool_password": "",
                        "use_nicehash": false,
                        "use_tls": false,
                        "tls_fingerprint": "",
                        "pool_weight": 1
                    },
                ],`
            }
        ]
    },
    {
        name: 'XMRig',
        os: [
            {
                name: 'Linux',
                command: `./xmrig -a cryptonight-lite -o %1$s:%2$s -u %3$s -p x -k`,
                config: outdent `
                "pools": [
                    {
                        "url": "%1$s:%2$s",
                        "user": "%3$s",
                        "pass": "x",
                        "keepalive": true,
                        "nicehash": false,
                        "variant": 1
                    }
                ],`
            },
            {
                name: 'Windows',
                command: `xmrig.exe -a cryptonight-lite -o %1$s:%2$s -u %3$s -p x -k`,
                config: outdent `
                "pools": [
                    {
                        "url": "%1$s:%2$s",
                        "user": "%3$s",
                        "pass": "x",
                        "keepalive": true,
                        "nicehash": false,
                        "variant": 1
                    }
                ],`
            },
            {
                name: 'Mac',
                command: `./xmrig -a cryptonight-lite -o %1$s:%2$s -u %3$s -p x -k`,
                config: outdent `
                "pools": [
                    {
                        "url": "%1$s:%2$s",
                        "user": "%3$s",
                        "pass": "x",
                        "keepalive": true,
                        "nicehash": false,
                        "variant": 1
                    }
                ],`
            }
        ]
    },
    {
        name: 'SRBMiner',
        os: [
            {
                name: 'Windows',
                command: `SRBMiner-CN.exe --sendallstales --ccryptonighttype liteV7 --cgpuid 0 --cgpuintensity 120 --cgputhreads 2 --cpool %1$s:%2$s --cwallet %3$s`,
                config: outdent`
                {
                    "pools" : [
                            {"pool" : "%1$s:%2$s", "wallet" : "%3$s", "password" : "x"}
                        ]
                }`
            }
        ]
    }
]
