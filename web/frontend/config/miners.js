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
                ],
                "currency": "cryptonight_lite_v7",`
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
                ],
                "currency": "cryptonight_lite_v7",`
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
                ],
                "currency": "cryptonight_lite_v7",`
            }
        ]
    },
    {
        name: 'XMRig',
        os: [
            {
                name: 'Linux',
                command: `./xmrig --algo=cryptonight-lite --variant 1 -o %1$s:%2$s -u %3$s -k --donate-level=1`,
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
                command: `xmrig.exe --algo=cryptonight-lite --variant 1 -o %1$s:%2$s -u %3$s -k --donate-level=1`,
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
                command: `./xmrig --algo=cryptonight-lite --variant 1 -o %1$s:%2$s -u %3$s -k --donate-level=1`,
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
        name: 'XMRig-AMD',
        os: [
            {
                name: 'Linux',
                command: `./xmrig-amd --algo=cryptonight-lite --variant 1 -o %1$s:%2$s -u %3$s -k --donate-level=1`,
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
                command: ``,
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
                command: `./xmrig-amd --algo=cryptonight-lite --variant 1 -o %1$s:%2$s -u %3$s -k --donate-level=1`,
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
        name: 'XMRig-NVIDIA',
        os: [
            {
                name: 'Linux',
                command: `./xmrig-nvidia --algo=cryptonight-lite --variant 1 -o %1$s:%2$s -u %3$s -k --donate-level=1`,
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
                command: ``,
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
                command: `./xmrig-nvidia --algo=cryptonight-lite --variant 1 -o %1$s:%2$s -u %3$s -k --donate-level=1`,
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
        name: 'XMRigCC',
        os: [
            {
                name: 'Linux',
                command: ``,
                config: outdent `
                "pools": [
                    {
                        "url": "%1$s:%2$s",
                        "user": "%3$s",
                        "pass": "x",
                        "keepalive": true,
                        "nicehash": false
                    }
                ],`
            },
            {
                name: 'Windows',
                command: ``,
                config: outdent `
                "pools": [
                    {
                        "url": "%1$s:%2$s",
                        "user": "%3$s",
                        "pass": "x",
                        "keepalive": true,
                        "nicehash": false
                    }
                ],`
            },
            {
                name: 'Mac',
                command: ``,
                config: outdent `
                "pools": [
                    {
                        "url": "%1$s:%2$s",
                        "user": "%3$s",
                        "pass": "x",
                        "keepalive": true,
                        "nicehash": false
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
                    "pools": [
                        {
                            "pool": "%1$s:%2$s",
                            "wallet": "%3$s",
                            "password": "x"
                        }
                    ]
                }`
            }
        ]
    }
]
