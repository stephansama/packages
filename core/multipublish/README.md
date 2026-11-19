<div align="center">

# [`@stephansama`](https://github.com/stephansama) / multipublish

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/multipublish)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/multipublish)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fmultipublish?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/multipublish)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/multipublish)](https://socket.dev/npm/package/@stephansama/multipublish/overview)
[![jsr](https://jsr.io/badges/@stephansama/multipublish)](https://jsr.io/@stephansama/multipublish)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/multipublish?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/multipublish)

[![yaml](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MyIgaGVpZ2h0PSIyMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJ5YW1sOiAyLjguMiI+PHRpdGxlPnlhbWw6IDIuOC4yPC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjkzIiBoZWlnaHQ9IjIwIiByeD0iMyIvPjwvY2xpcFBhdGg+PGcgY2xpcC1wYXRoPSJ1cmwoI3IpIj48cmVjdCB3aWR0aD0iNTQiIGhlaWdodD0iMjAiIGZpbGw9IiNjYjE3MWUiLz48cmVjdCB4PSI1NCIgd2lkdGg9IjM5IiBoZWlnaHQ9IjIwIiBmaWxsPSIjY2IxNzFlIi8+PHJlY3Qgd2lkdGg9IjkzIiBoZWlnaHQ9IjIwIiBmaWxsPSJ1cmwoI3MpIi8+PC9nPjxnIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJWZXJkYW5hLEdlbmV2YSxEZWphVnUgU2FucyxzYW5zLXNlcmlmIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBmb250LXNpemU9IjExMCI+PGltYWdlIHg9IjUiIHk9IjMiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgaHJlZj0iZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJK1BIQmhkR2dnWm1sc2JEMGlJMlptWm1abVppSWdaRDBpYlRBZ0xqazNJRFF1TVRFeElEWXVORFV6ZGpRdU1EbG9NaTQyTXpoMkxUUXVNRGxNTVRFdU1EVXpMamsyT1VnNExqSXhORXcxTGpVNElEVXVNVEkxSURJdU9UWTFMamsyT1ZwdE1USXVNRGt6TGpBeU5DMDBMalEzSURFd0xqVTBOR2d5TGpFeE5Hd3VPVGN0TWk0ek5EVm9OQzQzTnpWc0xqZ3dOQ0F5TGpNME5XZ3lMakkyVERFMExqSTFOUzQ1T1RSYWJURXVNVE16SURJdU1qSTFJREV1TkRZeklETXVPRGRvTFRNdU1EazJlbTB6TGpBMklEa3VORGMxZGpFd0xqSTVTREkwZGkweUxqRTVPV2d0TlM0ME5UUjJMVGd1TURreGVtMHRNVEl1TVRjMUxqQXdNbll4TUM0ek16Vm9NaTR5TVRkMkxUY3VNVEk1YkRJdU16SWdOQzQzT1RKb01TNDNORFpzTWk0MExUUXVPVFoyTnk0eU9UVm9NaTR4TWpkV01USXVOamsyYUMweUxqa3dORXc1TGpRMElERTNMak0zYkMweUxqUTFOUzAwTGpZM05Gb2lMejQ4TDNOMlp6ND0iLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjM2NSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjI3MCI+eWFtbDwvdGV4dD48dGV4dCB4PSIzNjUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iMjcwIj55YW1sPC90ZXh0PjwvZz48dGV4dCB4PSIzNjUiIHk9IjE0MCIgdGV4dExlbmd0aD0iMjcwIj55YW1sPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjcyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjI5MCI+Mi44LjI8L3RleHQ+PHRleHQgeD0iNzI1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjI5MCI+Mi44LjI8L3RleHQ+PC9nPjx0ZXh0IHg9IjcyNSIgeT0iMTQwIiB0ZXh0TGVuZ3RoPSIyOTAiPjIuOC4yPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/yaml)
[![zod](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NSIgaGVpZ2h0PSIyMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJ6b2Q6IDQuMi4xIj48dGl0bGU+em9kOiA0LjIuMTwvdGl0bGU+PGZpbHRlciBpZD0iYmx1ciI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTYiLz48L2ZpbHRlcj48bGluZWFyR3JhZGllbnQgaWQ9InMiIHgyPSIwIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYmJiIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9InIiPjxyZWN0IHdpZHRoPSI4NSIgaGVpZ2h0PSIyMCIgcng9IjMiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9IjQ2IiBoZWlnaHQ9IjIwIiBmaWxsPSIjNDA4YWZmIi8+PHJlY3QgeD0iNDYiIHdpZHRoPSIzOSIgaGVpZ2h0PSIyMCIgZmlsbD0iIzQwOGFmZiIvPjxyZWN0IHdpZHRoPSI4NSIgaGVpZ2h0PSIyMCIgZmlsbD0idXJsKCNzKSIvPjwvZz48ZyBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iVmVyZGFuYSxHZW5ldmEsRGVqYVZ1IFNhbnMsc2Fucy1zZXJpZiIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgZm9udC1zaXplPSIxMTAiPjxpbWFnZSB4PSI1IiB5PSIzIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGhyZWY9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSStQSEJoZEdnZ1ptbHNiRDBpSTJabVptWm1aaUlnWkQwaVRUSXVOVGcwSURNdU5UZ3lZVEl1TWpRM0lESXVNalEzSURBZ01DQXhJREl1TVRFeUxURXVORGM1YURFMExqWXhOMk11T1RRNElEQWdNUzQzT1RRdU5UazFJREl1TVRFMUlERXVORGczYkRJdU5EUWdOaTQzTnpkaE1pNHlORGdnTWk0eU5EZ2dNQ0F3SURFdExqWXlOQ0F5TGpRME0yd3RPUzQyTVNBNExqVXlZVEl1TWpRM0lESXVNalEzSURBZ01DQXhMVEl1T1RZekxqQXhPRXd1TnpjMklERXlMamMzTTJFeUxqSTBPQ0F5TGpJME9DQXdJREFnTVMwdU5qUXRNaTQwTmpkYWJURXlMakF6T0NBMExqZzROeTA1TGpFeElEVXVOVE0zSURVdU56UWdOUzR3TURkakxqUTFOaTR6T1RrZ01TNHhNemt1TXprMklERXVOVGt6TFM0d01EWnNOUzQyTkRNdE5TNHdNREZJTVRRdU5HdzJMakl6T1MwekxqazFOMk11TkRnNExTNHpNamd1TmprdExqazBOeTQwT1RFdE1TNDFiQzB4TGpJMExUTXVORFEyWVRFdU5UTTFJREV1TlRNMUlEQWdNQ0F3TFRFdU5EVTJMVEV1TURFMVNEVXVOVFExWVRFdU5UTTFJREV1TlRNMUlEQWdNQ0F3TFRFdU5ETXhJREV1TURGc0xURXVNakk0SURNdU16ZDZJaTgrUEM5emRtYysiLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjMyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjE5MCI+em9kPC90ZXh0Pjx0ZXh0IHg9IjMyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSIxOTAiPnpvZDwvdGV4dD48L2c+PHRleHQgeD0iMzI1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjE5MCI+em9kPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjY0NSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjI5MCI+NC4yLjE8L3RleHQ+PHRleHQgeD0iNjQ1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjI5MCI+NC4yLjE8L3RleHQ+PC9nPjx0ZXh0IHg9IjY0NSIgeT0iMTQwIiB0ZXh0TGVuZ3RoPSIyOTAiPjQuMi4xPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/zod)
[![@tanstack/intent](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjciIGhlaWdodD0iMjAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iQHRhbnN0YWNrL2ludGVudDogMC4wLjQxIj48dGl0bGU+QHRhbnN0YWNrL2ludGVudDogMC4wLjQxPC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjE2NyIgaGVpZ2h0PSIyMCIgcng9IjMiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9IjEyMiIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwYTZmNCIvPjxyZWN0IHg9IjEyMiIgd2lkdGg9IjQ1IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDBhNmY0Ii8+PHJlY3Qgd2lkdGg9IjE2NyIgaGVpZ2h0PSIyMCIgZmlsbD0idXJsKCNzKSIvPjwvZz48ZyBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iVmVyZGFuYSxHZW5ldmEsRGVqYVZ1IFNhbnMsc2Fucy1zZXJpZiIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgZm9udC1zaXplPSIxMTAiPjxpbWFnZSB4PSI1IiB5PSIzIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGhyZWY9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSStQSEJoZEdnZ1ptbHNiRDBpSTJabVptWm1aaUlnWkQwaVRURXhMakEzT0M0d05ESmpMak14TmkwdU1EUXlMalkxTFM0d01UUXVPVGN0TGpBeE5DQXhMakU0TVNBd0lESXVNelF4TGpFNE5DQXpMalEzTWk0MU16SmhNVEl1TXlBeE1pNHpJREFnTUNBeElETXVPVGN6SURJdU1EZzJJREV4TGprZ01URXVPU0F3SURBZ01TQXpMalF6TWlBMExqTXpZekV1TkRRMklETXVNVFVnTVM0ME16WWdOaTQ1TnkwdU1EUTJJREV3TGpFd055MHVPVFU0SURJdU1ESTVMVEl1TkRrMUlETXVOekkzTFRRdU16VTJJRFF1T1RZMUxURXVOVEU0SURFdU1ERXRNeTR5T1RNZ01TNDJNamt0TlM0eElERXVPRFE0TFRJdU1qazRMakkzT1MwMExqYzROQzB1TVRJNUxUWXVPRFV0TVM0eE9EZ3RNeTQ0T0MweExqazVMVFl1TlRFNExUVXVPVGswTFRZdU5UY3RNVEF1TXpneUxTNHdNUzB1T0RRMkxqQXdNeTB4TGpZNU55NHhOeTB5TGpVek5DNHlOek10TVM0ek5qVXVOelE0TFRJdU5qZ3pJREV1TkRZekxUTXVPRGhoTVRJZ01USWdNQ0F3SURFZ01pNDVOall0TXk0ek5rRXhNaTR6SURFeUxqTWdNQ0F3SURFZ09TNHpOVGN1TTJFeE1pQXhNaUF3SURBZ01TQXhMakkxTlMwdU1td3VNVE16TFM0d01UWjZUVGN1TURZMElERTVMams1WXkwdU5UTTFMakExTnkweExqQTVPQzR4TlRRdE1TNDFOVGN1TkRVMExqRXdNeTR3TWpVdU1qSXlJREFnTGpNeklEQWdMakkxT0NBd0lDNDFNaTB1TURFdU56YzRMakF3TWk0Mk5EY3VNREk0SURFdU16SXVNVE14SURFdU9UUTFMak13TXk0NExqSXlJREV1TlRBMUxqWTFJREl1TWpjMUxqazBNaTQ0TVRNdU16QTNJREV1TmpJeUxqUXdNaUF5TGpRNE5DNDBNREl1TkRNMUlEQWdMamcyTmkwdU1EQXhJREV1TWpnM0xTNHhNaTB1TWpJdExqRXhOeTB1TlRNMExTNHdPVFV0TGpjM09DMHVNVFEwWVRFeElERXhJREFnTUNBeExURXVOVFUyTFM0ME1UWWdNVElnTVRJZ01DQXdJREV0TVM0d09UTXRMalEyTjJ3dExqSXpMUzR4TURoaE1UVWdNVFVnTUNBd0lEQXRNUzR3TVRJdExqUTBZeTB1T1RBMUxTNHpORE10TVM0NU1EZ3RMalV4TWkweUxqZzNNeTB1TkRBNGJTNDRNRGd0TWk0eU56UmpMVEV1TURVNUlEQXRNaTR4TXk0eE9EY3RNeTR3T0RNdU5qWTNjUzB1TXpRMkxqRTNOeTB1TmpVNUxqUXhZeTB1TURZekxqQTBOaTB1TVRjMUxqRXdOaTB1TVRrNUxqRTRPSE11TURZeExqRTFNUzR4TVM0eU1EUmpMakl6T0MwdU1USTNMalEyTkMwdU1qWXhMamN4T0MwdU16VTNJREV1TmpRdExqWXlOQ0F6TGpZekxTNDBPVE1nTlM0eU5qZ3VNRGM0TGpneE55NHlPRFVnTVM0MU5qa3VOekV5SURJdU16WTFJREV1TURRMkxqZzVMak0zTkNBeExqYzVPQzQyTVRZZ01pNDNOVE11TnpRZ01TNHhNamN1TVRRM0lESXVOREV5TGpBeU9DQXpMalEwTWkwdU5EZ3VNell5TFM0eE56a3VPRFkxTFM0ME5URWdNUzR3TVRndExqZzBOeTB1TVRnNUxqQXhOeTB1TXpZdU1EazRMUzQxTXprdU1UVTBZVGtnT1NBd0lEQWdNUzB1T0RZNExqSXlNbU10TGprNU5DNHlMVEl1TURVeUxqSTBMVE11TURVekxqQTJMUzQ1TkRNdExqRTNMVEV1T0RJdExqVXhNeTB5TGpZNU15MHVPRGN6YkMwdU1URXhMUzR3TkRZdExqSXlNeTB1TURreUxTNHhNVEl0TGpBME5tRXlOaUF5TmlBd0lEQWdNQzB4TGpNMUxTNDFNamRqTFM0NE9TMHVNekV0TVM0NE5ESXRMalV0TWk0M09EUXRMalZOT1M0M01qZ2dNUzQwTlRKakxURXVNamN1TWpndE1pNDBNRGN1T0RJMkxUTXVOVEF5SURFdU5URTBMUzQyTXpjdU5DMHhMakkwTlM0NE1TMHhMamM1TmlBeExqTXlNeTB1T0RJdU56WTFMVEV1TkRRM0lERXVOamsxTFRFdU9Ua3pJREl1TmpZMkxTNDFOak1nTVMwdU9USTBJREl1TVRZMkxURXVNRGs0SURNdU1qazNMUzR4TnpJZ01TNHhNUzB1TWlBeUxqSTNOeTB1TURBMElETXVNemc0TGpJME5TQXhMak00T0M0M01USWdNaTQyT1RFZ01TNDBORGdnTXk0NE9UY3VNalE0TFM0eE1UWXVOREkwTFM0ek9DNDJNamt0TGpVMU55NDBNVFF0TGpNMU9TNDROUzB1TmpreElERXVNekUzTFM0NU56aGhNeTQxSURNdU5TQXdJREFnTVNBdU5UTTVMUzR5TmpSakxqQTNMUzR3TWprdU1UZzNMUzR3TlRVdU1qSXRMakV6TWk0d05UTXRMakV5TkMwdU1EUTFMUzR6TkMwdU1EWXlMUzQwTmpoaE55QTNJREFnTUNBeExTNHdOamd0TVM0eE1Ea2dPUzQzSURrdU55QXdJREFnTVNBdU5qRXRNeTR4TnpkakxqSTVMUzQzTmk0M015MHhMalExSURFdU1qVTBMVEl1TURZNUxqRTNOeTB1TWpFdU16WTFMUzQwTURVdU5UWXRMall1TVRFMUxTNHhNVFF1TWpVNExTNHlNVEl1TXpNdExqTTFPUzB1TXpjMklEQXRMamMxTVM0eE1EZ3RNUzR4TURndU1qRTRMUzQzTmprdU1qTTNMVEV1TlRFNExqVTRPQzB5TGpFMU5TQXhMakE0TkMwdU1qa3hMakl5TmkwdU5UQTBMalV5TWkwdU56YzVMamMyTFM0d09EUXVNRGN6TFM0eU16VXVNVGN0TGpNMU1pNHhNVFl0TGpFM05pMHVNRGd6TFM0eE5Ea3RMalF6TFM0eE5qa3RMalU1TFM0d056Z3RMall4TWk0eE5UUXRNUzR6T0RjdU5EVXRNUzQ1TVRndU5EY3pMUzQ0TlRJZ01TNHpORGd0TVM0MU9DQXlMak0zTmkweExqVTFOUzQwTkRRdU1ERXhMamd6TXk0eE5qWWdNUzR5TlRjdU1qWTJMUzR4TURjdExqRTFNeTB1TWpVeUxTNHlOalF0TGpNNE9TMHVNemxoTlM0MElEVXVOQ0F3SURBZ01DMHhMakV3TnkwdU9HTXRMakUyTXkwdU1EZzFMUzR6TXpndExqRXpOaTB1TlRBNUxTNHlMUzR3T0RZdExqQXpMUzR4T1RVdExqQTNOQzB1TWpJM0xTNHhOeTB1TURZdExqRTNOeTR5TmkwdU16UXlMak0zTnkwdU5ERTNMalExTXkwdU1qZzVJREV1TURFdExqVXlOeUF4TGpVMU5pMHVOVFF1T0RVMExTNHdNakVnTVM0Mk9EZ3VORFV5SURJdU1EUWdNUzR5TlRndU1USXpMakk0TkM0eE5pNDFPRE11TVRnMExqZzROV3d1TURBMExqQTFOeTR3TURZdU1EZzFMakF3TWk0d01qa3VNREExTGpBMU55NHdNRFF1TURVMll5NHlOamd0TGpJeE9DNDBOVGN0TGpVMExqY3hPQzB1TnpjMExqWXhNaTB1TlRRM0lERXVORFV0TGpjNUlESXVNalExTFM0MU5EUmhNaTQ1TnlBeUxqazNJREFnTUNBeElERXVOekVnTVM0ek56aGpMakE1Tnk0eE56TXVNelkxTGpVNU5TNHhOekV1TnpZM0xTNHhOVEl1TVRNMExTNHpORFF1TURNdExqVXdOQzB1TURJMllUTWdNeUF3SURBZ01DMHVNemN5TFM0d09UUnNMUzR3TmpndExqQXhOQzB1TURZNUxTNHdNVE5oTXk0NUlETXVPU0F3SURBZ01DMHhMak0zTnkwdU1EQXlZeTB1TWpneUxqQTFMUzQxTlRjdU1UVXRMamd6T0M0eE9USjJMakEyWXk0M05qZ3VNREEySURFdU5URXVORFEwSURFdU9Ea2dNUzR4TURrdU1UVTNMakkzTlM0eU16VXVOVGt1TWprMUxqa3VNRGMxTGpNNExqQXlNaTQzT1RZdExqQTRNaUF4TGpFMk9DMHVNRE0xTGpFeU5TMHVNRGs0TGpNek5pMHVNalEzTGpNMk5TMHVNVEEyTGpBeUxTNHhPVFV0TGpBNE5TMHVNalUyTFM0eE5UVmhOQzQySURRdU5pQXdJREFnTUMwdU5Ea3lMUzQxTWpJZ01qQWdNakFnTUNBd0lEQXRNUzQwTmpjdE1TNHhOR010TGpJMk55MHVNVGt0TGpVMkxTNDBOQzB1T0RZNExTNDFOVFl1TURnM0xqSXdPQzR4TnpFdU5EQXlMakl1TmpNdU1EZzRMalkyTnkwdU1Ua3lJREV1TWprMkxTNDJNVElnTVM0M09UaGhNaTQySURJdU5pQXdJREFnTVMwdU5ESTJMalF5TjJNdExqQTJOeTR3TlMwdU1UVXhMakV4TkMwdU1qUXVNUzB1TWpjM0xTNHdORFF0TGpNeExTNDBOak10TGpNMU15MHVOamMzTFM0eE5EUXRMamN5TmkwdU1EZzJMVEV1TkRRM0xqRXhOQzB5TGpFMU9DMHVNVGM0TGpBNUxTNHpNRGN1TWpnM0xTNDBNVGd1TkRWaE5TNHpJRFV1TXlBd0lEQWdNQzB1TmpFeUlERXVNVE00WXkwdU5qRWdNUzQyTVRjdExqWXdOQ0F6TGpVeExqRTROaUExTGpBMk5pNHdPRGd1TVRjMExqSXlNUzR4TlM0ek9UVXVNVFZvTGpFMU4yRXpJRE1nTUNBd0lERWdMalEzTWk0d01UaGpMakE0TGpBeExqRTVNeUF3SUM0eU5UY3VNRFl1TURjM0xqQTNNaTR3TXpZdU1UazBMakF4T0M0eU9ESXRMakExTGpJME5pMHVNRFkyTGpRMk9TMHVNRFkyTGpjeUxqTXlPQzB1TURVeExqUXhPUzB1TlRjMkxqVXpOUzB1T0RRdU1UTXhMUzR5T1RndU1qWTFMUzQxT1RjdU16ZzNMUzQ1TGpBMkxTNHhORGd1TVRRdExqTXhOQzR4TVRrdExqUTNPUzB1TURJMExTNHhPRFV0TGpFMU55MHVNemd4TFM0eU5TMHVOVFF0TGpFM055MHVNams0TFM0ek56Z3RMall3TmkwdU5UQTRMUzQ1TWprdExqRXdOQzB1TWpVNExTNHdNRGN0TGpVNExqSTROaTB1TmpjeUxqRTJNUzB1TURVdU16TTBMakEwT1M0ME16a3VNVFkyTGpJeUxqSTBOQzR6TmpNdU5qQTVMalV5TXk0NE9UWnNNUzR5TkRrZ01pNHlORGh4TGpFMU9TNHlPRFl1TXpJdU5UZGpMakEwTXk0d056UXVNRGcyTGpFNE9DNHhOek11TWpFNUxqQTNOeTR3TWpndU1UZ3lMUzR3TVRJdU1qWXRMakF5Tnk0eE9UZ3RMakEwTGpNNU9DMHVNRGd6TGpVNU9DMHVNVEl1TWpRdExqQTBNeTQyTURVdExqQXpOUzQzTnpndExqSXlNaTB1TWpVekxTNHdPQzB1TlRRMUxTNHdOelV0TGpnd09DMHVNRFUzTFM0eE5UZ3VNREV0TGpNek15NHdOamN0TGpRM09TMHVNREkxTFM0eU1UWXRMakV6TnkwdU16WXRMalExTlMwdU5Ea3lMUzQyTmpjdExqTXlOaTB1TlRJMUxTNDJNek10TVM0d05UY3RMamswTlMweExqVTViQzB1TURVdExqQTROQzB1TVMwdU1UZHhMUzR3TnpVdExqRXlOaTB1TVRRNUxTNHlOVFZqTFM0d016Y3RMakEyTmkwdU1Ea3lMUzR4TlRNdExqQXpPUzB1TWpJM0xqQTFOaTB1TURjMkxqRTNPUzB1TURndU1qa3RMakE0TVdndU1ESXhjUzR3TmpZdU1EQXhMakV4TnkwdU1EQTBZVEV3SURFd0lEQWdNQ0F4SURFdU16UTNMUzR4TURkakxTNHdNelV0TGpFeU1pMHVNVE0xTFM0eU5pMHVNVEF6TFM0ek9TNHdOekV0TGpJNU1pNDBPUzB1TXpnekxqWTROaTB1TVRjMExqRXpNUzR4TkM0eU1EY3VNek0wTGpJNU1pNDFNRFF1TVRFekxqSXlNeTR5TkM0ME5DNHpOakV1TmpZdU1qRXhMak00TXk0ME5ERXVOelUzTGpZMU9DQXhMakV6T0d3dU1EVTFMakE1TkM0d01qZ3VNRFEzWXk0d09UTXVNVFUyTGpFNE55NHpNVFF1TWpNNExqUTRPUzB1TnpVekxTNHdNelV0TVM0ek1UZ3RMamt3T1MweExqWTBOaTB4TGpRNU9TMHVNREkzTGpBNU5TNHdNVFl1TVRjNUxqQTFMakkzY1M0eE1ETXVNamd5TGpJMk1pNDFOR011TVRVeUxqSTBOQzR6TWpZdU5EazFMalUxTmk0Mk56TXVOREE0TGpNeE5TNDVORFV1TXpFM0lERXVORE0yTGpJNE15NHpNVFV0TGpBeU1pNDNNRGd0TGpFMk5TQXhMakF4T0MwdU1EWTRjeTQwTXpRdU5ETTRMakkxTGpkakxTNHhNemd1TVRrMkxTNHpNakV1TWpjdExqVTFMak11TVRZeUxqTTBOaTR6TnpNdU5qWTNMalV5TnlBeExqQXlMakEyTkM0eE5EWXVNVE11TXpjdU1qZ3pMalEwT0M0eE1ESXVNRFV4TGpJME9DNHdNRE11TXpVNElEQXRMakV4TFM0eU9USXRMak14TnkwdU5UUXRMalF4T1MwdU9ETTVMak14TGpBeE5TNDJNUzR4TnpZdU9EazRMakk0TGpVMk55NHlNRElnTVM0eE1qZ3VOREkwSURFdU5qZzNMalkwT0d3dU1qVTRMakV3TkdNdU1qTXVNRGt5TGpRMk1pNHhPRE11TmpnNUxqSTRNeTR3T0RNdU1ETTNMakU1T0M0eE1qTXVNamt1TURjdU1EYzBMUzR3TkRNdU1USXpMUzR4TkRZdU1UWTVMUzR5TVRWaE1UQXVNeUF4TUM0eklEQWdNQ0F3SURFdU16a3pMVE11TWpBNFl5NDNOUzB5TGprNE9TNHhNRFl0Tmk0eU9EY3RNUzQyT1RVdE9DNDNPRE10TGpZNU1pMHVPVFl0TVM0MU5qSXRNUzQzT0RrdE1pNDFNakl0TWk0ME56WXRNaTQwTURFdE1TNDNNVGd0TlM0MU5URXRNaTQwTURjdE9DNDBOQzB4TGpjMk9HMDBMamt3T0NBeE5DNDVNRFJqTFM0Mk16WXVNVFkyTFRFdU1qa3lMak14TnkweExqazBOUzQwTURFdU1EZzJMakk1TXk0eU9UWXVOVGMzTGpRMUxqZzBMakExT1M0eE1ERXVNVEl5TGpJek55NHlOQzR5T0RFdU1UTXlMakExTGpJNU1pMHVNRE11TkRFM0xTNHdOekl0TGpBMU9DMHVNVFU0TFM0eE5UVXRMak10TGpJek5TMHVORFV0TGpBek15MHVNRFl0TGpBNE5DMHVNVE16TFM0d05UWXRMakl3Tmk0d05TMHVNVE0zTGpJMk15MHVNVE11TXpneExTNHhOVE11TXpFdExqQTJNeTQyTVRjdExqRTBNaTQ1TWpndExqSXdOQzR4TVRRdExqQXlNeTR5TnpRdExqQTROUzR6T0RrdExqQTBOeTR3T0RZdU1ETXVNVE00TGpFdU1UZzNMakUzTkd3dU1ESXlMakF6TTNFdU1EUXpMakEzTGpBNU55NHhNakpqTGpFeU5TNHhNVE11TXpFekxqRXpMalEzTWk0eE5qSXRMakE1TnkwdU1qRTVMUzR5TlRrdExqUXhMUzR6TmpJdExqWXpMUzR3TmkwdU1USTNMUzR4TVMwdU16RTFMUzR5TkRJdExqTTRPQzB1TVRneUxTNHhNREl0TGpVMU55NHdPRGt0TGpjME15NHhNemR0TFRRdU1ERXRNUzQwTlRkakxTNHdNeTR6T0MwdU1UUTNMalk0T1MwdU16TWdNUzR3TVRrdU1qRXVNREkyTGpReU15NHdNell1TmpJNUxqQTROeTR4TlRRdU1ETTRMakk1Tmk0eE1TNDBORGt1TVRVekxTNHdPREl0TGpJeU5DMHVNak16TFM0ME1qTXRMak0xTFM0Mk15MHVNVEl0TGpJd09DMHVNakkyTFM0ME5qSXRMak01T0MwdU5qTWlMejQ4TDNOMlp6ND0iLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjcwNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9Ijk1MCI+QHRhbnN0YWNrL2ludGVudDwvdGV4dD48dGV4dCB4PSI3MDUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iOTUwIj5AdGFuc3RhY2svaW50ZW50PC90ZXh0PjwvZz48dGV4dCB4PSI3MDUiIHk9IjE0MCIgdGV4dExlbmd0aD0iOTUwIj5AdGFuc3RhY2svaW50ZW50PC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjE0MzUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuOCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiB0ZXh0TGVuZ3RoPSIzNTAiPjAuMC40MTwvdGV4dD48dGV4dCB4PSIxNDM1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjM1MCI+MC4wLjQxPC90ZXh0PjwvZz48dGV4dCB4PSIxNDM1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjM1MCI+MC4wLjQxPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/@tanstack/intent)
[![jsr](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NyIgaGVpZ2h0PSIyMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJqc3I6IDAuMTMuNSI+PHRpdGxlPmpzcjogMC4xMy41PC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9Ijg3IiBoZWlnaHQ9IjIwIiByeD0iMyIvPjwvY2xpcFBhdGg+PGcgY2xpcC1wYXRoPSJ1cmwoI3IpIj48cmVjdCB3aWR0aD0iNDIiIGhlaWdodD0iMjAiIGZpbGw9IiNmN2RmMWUiLz48cmVjdCB4PSI0MiIgd2lkdGg9IjQ1IiBoZWlnaHQ9IjIwIiBmaWxsPSIjZjdkZjFlIi8+PHJlY3Qgd2lkdGg9Ijg3IiBoZWlnaHQ9IjIwIiBmaWxsPSJ1cmwoI3MpIi8+PC9nPjxnIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJWZXJkYW5hLEdlbmV2YSxEZWphVnUgU2FucyxzYW5zLXNlcmlmIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBmb250LXNpemU9IjExMCI+PGltYWdlIHg9IjUiIHk9IjMiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgaHJlZj0iZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJK1BIQmhkR2dnWm1sc2JEMGlJMlptWm1abVppSWdaRDBpVFRNdU5qa3lJRFV1TlRNNGRqTXVOamt6U0RCMk55NHpPRFJvTnk0ek9EVjJNUzQ0TkRkb01USXVPVEl6ZGkwekxqWTVNMGd5TkZZM0xqTTROV2d0Tnk0ek9EVldOUzQxTXpoYWJURXVPRFEySURFdU9EUTNhREV1T0RRM2RqY3VNemcwU0RFdU9EUTJkaTB6TGpZNU1tZ3hMamcwTm5ZeExqZzBObWd4TGpnME5ucHRNeTQyT1RNZ01HZzFMalV6T0ZZNUxqSXphQzB6TGpZNU1uWXhMamcwTm1nekxqWTVNblkxTGpVek9FZzVMakl6TVZZeE5DNDNOMmd6TGpZNU1uWXRNUzQ0TkRaSU9TNHlNekZhYlRjdU16ZzBJREV1T0RRMmFEVXVOVE01ZGpNdU5qa3lhQzB4TGpnME5uWXRNUzQ0TkRab0xURXVPRFEyZGpVdU5UTTRhQzB4TGpnME4zb2lMejQ4TDNOMlp6ND0iLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiNjY2MiPjx0ZXh0IHg9IjMwNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjE1MCI+anNyPC90ZXh0Pjx0ZXh0IHg9IjMwNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSIxNTAiPmpzcjwvdGV4dD48L2c+PHRleHQgeD0iMzA1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjE1MCIgZmlsbD0iIzMzMyI+anNyPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiNjY2MiPjx0ZXh0IHg9IjYzNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjM1MCI+MC4xMy41PC90ZXh0Pjx0ZXh0IHg9IjYzNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSIzNTAiPjAuMTMuNTwvdGV4dD48L2c+PHRleHQgeD0iNjM1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjM1MCIgZmlsbD0iIzMzMyI+MC4xMy41PC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/jsr)
[![tsdown](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTkiIGhlaWdodD0iMjAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0idHNkb3duOiAwLjIxLjEwIj48dGl0bGU+dHNkb3duOiAwLjIxLjEwPC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjExOSIgaGVpZ2h0PSIyMCIgcng9IjMiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9IjY2IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMzE3OGM2Ii8+PHJlY3QgeD0iNjYiIHdpZHRoPSI1MyIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMxNzhjNiIvPjxyZWN0IHdpZHRoPSIxMTkiIGhlaWdodD0iMjAiIGZpbGw9InVybCgjcykiLz48L2c+PGcgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IlZlcmRhbmEsR2VuZXZhLERlamFWdSBTYW5zLHNhbnMtc2VyaWYiIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGZvbnQtc2l6ZT0iMTEwIj48aW1hZ2UgeD0iNSIgeT0iMyIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiBocmVmPSJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSFpwWlhkQ2IzZzlJakFnTUNBeU5DQXlOQ0krUEhCaGRHZ2dabWxzYkQwaUkyWm1abVptWmlJZ1pEMGlUVEl4TGpZMU1pQXdZeTQxTVRRZ01DQXVOemsyTGpZdU5EWTJMams1T0d3dE5TNDJNVFlnTmk0M05HTXRMalkyTWk0M09UTXRMakE1T0NBeExqazVOeTQ1TXpRZ01TNDVPVGRvTlM0ME16TmpMalV4TmlBd0lDNDNPVGN1Tmk0ME5qY3VPVGs0VERFeUxqUTJOeUF5TXk0M056VmhMall1TmlBd0lEQWdNUzB1TkRZNExqSXlOUzQyTGpZZ01DQXdJREV0TGpRMk9DMHVNakkxVEM0Mk5qRWdNVEF1TnpNellTNDJNRGt1TmpBNUlEQWdNQ0F4SUM0ME5qZ3RMams1T0VnMkxqVTJZekV1TURNeUlEQWdNUzQxT1RVdE1TNHlNRFF1T1RNM0xURXVPVGszVERFdU9EZ3VPVGs0UVM0Mk1EZ3VOakE0SURBZ01DQXhJREl1TXpRMklEQmFJaTgrUEM5emRtYysiLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjQyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjM5MCI+dHNkb3duPC90ZXh0Pjx0ZXh0IHg9IjQyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSIzOTAiPnRzZG93bjwvdGV4dD48L2c+PHRleHQgeD0iNDI1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjM5MCI+dHNkb3duPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjkxNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjQzMCI+MC4yMS4xMDwvdGV4dD48dGV4dCB4PSI5MTUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iNDMwIj4wLjIxLjEwPC90ZXh0PjwvZz48dGV4dCB4PSI5MTUiIHk9IjE0MCIgdGV4dExlbmd0aD0iNDMwIj4wLjIxLjEwPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

Publish packages to multiple providers easily

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [CLI Options](#cli-options)
- [Usage](#usage)
  - [Configuration](#configuration)
  - [GitHub NPM Registry](#github-npm-registry)
  - [JSR Configuration](#jsr-configuration)
  - [Changesets](#changesets)
    - [JSR](#jsr)
    - [Published packages](#published-packages)

</details>

## Installation

```sh
pnpm install @stephansama/multipublish
```

## CLI Options

| Option                 | Alias | Description                                           | Type      |
| :--------------------- | :---- | :---------------------------------------------------- | :-------- |
| `--config`             | `-c`  | Path to config file                                   | `string`  |
| `--dry`                | `-d`  | Perform a dry run                                     | `boolean` |
| `--released`           | `-r`  | Packages that have been updated and require a publish | `array`   |
| `--releasedFile`       | `-f`  | File denoting which packages have been updated        | `string`  |
| `--useChangesetStatus` | `-s`  | Path to changeset status file used to version release | `boolean` |
| `--verbose`            | `-v`  | Enable verbose logging                                | `boolean` |
| `--versionJsr`         | `-j`  | Update version JSR configuration files                | `boolean` |

## Usage

### Configuration

You can configure `multipublish` by creating a configuration file (or object) in the root of your project. The following file formats are supported:

- `package.json`
- `.multipublishrc.cjs`
- `.multipublishrc.js`
- `.multipublishrc.json`
- `.multipublishrc.mjs`
- `.multipublishrc.ts`
- `.multipublishrc.yaml`
- `.multipublishrc.yml`
- `.multipublishrc`
- `.config/.multipublishrc.json`
- `.config/.multipublishrc.yaml`
- `.config/.multipublishrc.yml`
- `.config/.multipublishrc`
- `.config/multipublishrc.cjs`
- `.config/multipublishrc.js`
- `.config/multipublishrc.json`
- `.config/multipublishrc.mjs`
- `.config/multipublishrc.ts`
- `.config/multipublishrc.yaml`
- `.config/multipublishrc.yml`
- `.config/multipublishrc`
- `multipublish.config.cjs`
- `multipublish.config.js`
- `multipublish.config.mjs`
- `multipublish.config.ts`

```json
{
  "$schema": "./node_modules/@stephansama/multipublish/dist/schema.json",
  "platforms": [
    ["jsr", { "experimentalGenerateJSR": true }],
    [
      "npm",
      {
        "registry": "https://npm.pkg.github.com",
        "tokenEnvironmentKey": "GITHUB_TOKEN"
      }
    ]
  ]
}
```

### GitHub NPM Registry

If publishing to the GitHub NPM registry, you must add `packages` to permissions when using a GitHub token. And allow `write` and `read` permissions for workflows (located in repo settings > actions > general).

```yaml
permissions:
  packages: write
```

### JSR Configuration

When publishing to JSR, you must either have a valid `jsr.json` or `deno.json`, or allow `experimentalGenerateJSR` using the config option.

JSR leaves out gitignored files, which usually includes your build output. multipublish adds a negated `publish.exclude` glob for every directory your `exports` point into (`!dist` for `./dist/index.mjs`), so build output is published without any config.

`defaultInclude` and `defaultExclude` are added to the JSR config's `publish.include` and `publish.exclude`. Use them for anything else, e.g. `"defaultExclude": ["!config"]` to publish a gitignored `config` directory. JSR only honors negated globs there, not in the top-level `exclude`.

If any publish fails, multipublish still tries the remaining platforms and packages, then exits with code `1` and lists what failed.

### Changesets

If you are using jsr this with changesets, please update your version script with a preversion script that calls the `multipublish` CLI in order to update your existing jsr configurations.

#### JSR

```json
{
  "scripts": {
    "preversion": "multipublish --useChangesetStatus --versionJsr",
    "version": "changeset version"
  }
}
```

#### Published packages

you can run multipublish after a changeset publish like so

```yaml
- if: github.ref_name == 'main'
  name: 🦋 Create Changeset Release
  uses: changesets/action@v1
  id: changesets
  with:
    commit: "chore: Update version for release"
    title: "chore: Update version for release"
    publish: pnpm run publish
    createGithubReleases: true
- name: publish to other registries
  if: steps.changesets.outputs.published == 'true'
  run: |
    echo "${{ steps.changesets.outputs.publishedPackages }}" | multipublish
```

<!-- ZOD path="./src/schema.ts" start -->

# Zod Schema

## Config

_Object containing the following properties:_

| Property             | Type                    | Default      |
| :------------------- | :---------------------- | :----------- |
| **`platforms`** (\*) | [Platforms](#platforms) |              |
| `tmpDirectory`       | `string`                | `'.release'` |
| `useChangesets`      | `boolean`               | `true`       |

_(\*) Required._

## JsrPlatformOptions

_Object containing the following properties:_

| Property                     | Type            | Default            |
| :--------------------------- | :-------------- | :----------------- |
| `allowSlowTypes`             | `boolean`       | `true`             |
| `defaultExclude`             | `Array<string>` |                    |
| `defaultInclude`             | `Array<string>` |                    |
| `experimentalGenerateJSR`    | `boolean`       | `false`            |
| `experimentalUpdateCatalogs` | `boolean`       | `false`            |
| `tokenEnvironmentKey`        | `string`        | `'JSR_AUTH_TOKEN'` |

_All properties are optional._

## NpmPlatformOptions

_Object containing the following properties:_

| Property              | Type                         | Default                         |
| :-------------------- | :--------------------------- | :------------------------------ |
| `registry`            | `string`                     | `'https://registry.npmjs.org/'` |
| `strategy`            | `'.npmrc' \| 'package.json'` | `'.npmrc'`                      |
| `tokenEnvironmentKey` | `string`                     | `'NODE_AUTH_TOKEN'`             |

_All properties are optional._

## Platforms

_Array of `'jsr' | 'npm'` *or* *Tuple:*<ol><li>`'jsr'`</li><li>[JsrPlatformOptions](#jsrplatformoptions)</li></ol> *or* *Tuple:*<ol><li>`'npm'`</li><li>[NpmPlatformOptions](#npmplatformoptions)</li></ol> items._

<!-- ZOD end -->
