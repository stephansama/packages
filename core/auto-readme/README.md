<div align="center">

# [`@stephansama`](https://github.com/stephansama) / auto-readme

<!-- BADGE start -->

[![source code](https://img.shields.io/badge/Source-666666?style=flat&logo=github&label=Github&labelColor=211F1F)](https://github.com/stephansama/packages/tree/main/core/auto-readme)
[![documentation](https://img.shields.io/badge/Documentation-211F1F?style=flat&logo=Wikibooks&labelColor=211F1F)](https://packages.stephansama.info/api/@stephansama/auto-readme)
[![npm](https://img.shields.io/npm/v/%40stephansama%2Fauto-readme?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/auto-readme)
[![socket.dev](https://badge.socket.dev/npm/package/@stephansama/auto-readme)](https://socket.dev/npm/package/@stephansama/auto-readme/overview)
[![jsr](https://jsr.io/badges/@stephansama/auto-readme)](https://jsr.io/@stephansama/auto-readme)
[![npm downloads](https://img.shields.io/npm/dw/@stephansama/auto-readme?labelColor=211F1F)](https://www.npmx.dev/package/@stephansama/auto-readme)

[![handlebars](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjciIGhlaWdodD0iMjAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iaGFuZGxlYmFyczogNC43LjkiPjx0aXRsZT5oYW5kbGViYXJzOiA0LjcuOTwvdGl0bGU+PGZpbHRlciBpZD0iYmx1ciI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTYiLz48L2ZpbHRlcj48bGluZWFyR3JhZGllbnQgaWQ9InMiIHgyPSIwIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYmJiIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9InIiPjxyZWN0IHdpZHRoPSIxMjciIGhlaWdodD0iMjAiIHJ4PSIzIi8+PC9jbGlwUGF0aD48ZyBjbGlwLXBhdGg9InVybCgjcikiPjxyZWN0IHdpZHRoPSI4OCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2Q0NjkyNiIvPjxyZWN0IHg9Ijg4IiB3aWR0aD0iMzkiIGhlaWdodD0iMjAiIGZpbGw9IiNkNDY5MjYiLz48cmVjdCB3aWR0aD0iMTI3IiBoZWlnaHQ9IjIwIiBmaWxsPSJ1cmwoI3MpIi8+PC9nPjxnIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJWZXJkYW5hLEdlbmV2YSxEZWphVnUgU2FucyxzYW5zLXNlcmlmIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBmb250LXNpemU9IjExMCI+PGltYWdlIHg9IjUiIHk9IjMiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgaHJlZj0iZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJK1BIQmhkR2dnWm1sc2JEMGlJMlptWm1abVppSWdaRDBpVFRrdU1TQTBMamswT0dFekxqUTFJRE11TkRVZ01DQXdJREF0TGpNNU9DNHdNVFJETmk0ek1pQTFMakUxSURVdU16Y3pJRFl1TXpjMUlEUXVPREF5SURZdU9XTXRMalUzTWk0MU1qVXRNUzQyTlRZZ01TNDNOak10TWk0ek56WWdNUzQxTkRVdExqY3lNUzB1TWpFM0xTNDVNalF0TVM0eE1EY3RMalkzTFRFdU16Z3hjeTQwTlRRdExqSXlOUzQyTVRNZ01HTXVNRGszTGpFNExqRTBOUzR6T0RNdU1UUXVOVGczWVRFdU16WWdNUzR6TmlBd0lEQWdNQ0F1TkRNNExTNDJOalV1TnpreUxqYzVNaUF3SURBZ01DMHVORFF6TFRFdU1ERTNZeTB4TGpNdExqWTFPUzB5TGpFek9TNDFNVFF0TWk0eU5pNDNPRGN0TGpFeU1pNHlOek10TGpNek5pNDNNRGN0TGpJZ01TNDJPVFV1TVRNMUxqazRPUzQyTVRJZ01TNDVNRElnTWk0eE1EUWdNaTR5TmpGaE5pNHpNU0EyTGpNeElEQWdNQ0F3SURRdU1qTTRMUzQwT1RWc05DNDBNUzB4TGpnMFlUVXVOREE0SURVdU5EQTRJREFnTUNBeElDNDFOVFl0TGpFd01YWTVMamcyTkdNd0lDNDFNRFl1TXpFMkxqa3hNeTQzTURndU9URXpMak01TVNBd0lDNDNNRGN0TGpRd055NDNNRGN0TGpreE0xWTRMakk1WVRVdU5EQTRJRFV1TkRBNElEQWdNQ0F4SUM0ME16Y3VNRGc0YkRRdU5ERWdNUzQ0TkdFMkxqTXhJRFl1TXpFZ01DQXdJREFnTkM0eU16Z3VORGswWXpFdU5Ea3lMUzR6TmlBeExqazJPUzB4TGpJM01pQXlMakV3TlMweUxqSTJMakV6TlMwdU9UZzVMUzR3T0MweExqUXlNeTB1TWkweExqWTVOaTB1TVRJeUxTNHlOek10TGprMk1pMHhMalEwTmkweUxqSTJNUzB1TnpnM1lTNDNPVEl1TnpreUlEQWdNQ0F3TFM0ME5ETWdNUzR3TVRkakxqQTNOaTR5Tmk0eU1qa3VORGt5TGpRek55NDJOalZoTVM0eE9TQXhMakU1SURBZ01DQXhJQzR4TkRFdExqVTROMk11TVRVNUxTNHlNalV1TXpVNUxTNHlOelF1TmpFeklEQnpMakExTVNBeExqRTJOQzB1TmpjZ01TNHpPREpqTFM0M01pNHlNVGN0TVM0NE1EUXRNUzR3TWkweUxqTTNOaTB4TGpVME5pMHVOVGN4TFM0MU1qVXRNUzQxTVRndE1TNDNOUzB6TGprdE1TNDVNemhCTXk0ME5TQXpMalExSURBZ01DQXdJREV5SURZdU5qVXpZVE11TkRVZ015NDBOU0F3SURBZ01DMHlMamt0TVM0M01EVjZiVEV5TGpNNUlESXVOekF6ZGk0d01EUnNMakF3Tmk0d01ESmpMUzR3TURJdExqQXdNaTB1TURBMExTNHdNRFF0TGpBd05pMHVNREEwZW0wdE1UZ3VPVGdnTUdNdExqQXdNaTR3TURJdExqQXdOQzR3TURRdExqQXdOaTR3TURSc0xqQXdOaTB1TURBeFZqY3VOalY2SWk4K1BDOXpkbWMrIi8+PGcgdHJhbnNmb3JtPSJzY2FsZSguMSkiPjxnIGFyaWEtaGlkZGVuPSJ0cnVlIiBmaWxsPSIjMDEwMTAxIj48dGV4dCB4PSI1MzUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuOCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiB0ZXh0TGVuZ3RoPSI2MTAiPmhhbmRsZWJhcnM8L3RleHQ+PHRleHQgeD0iNTM1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjYxMCI+aGFuZGxlYmFyczwvdGV4dD48L2c+PHRleHQgeD0iNTM1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjYxMCI+aGFuZGxlYmFyczwvdGV4dD48L2c+PGcgdHJhbnNmb3JtPSJzY2FsZSguMSkiPjxnIGFyaWEtaGlkZGVuPSJ0cnVlIiBmaWxsPSIjMDEwMTAxIj48dGV4dCB4PSIxMDY1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjgiIGZpbHRlcj0idXJsKCNibHVyKSIgdGV4dExlbmd0aD0iMjkwIj40LjcuOTwvdGV4dD48dGV4dCB4PSIxMDY1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjI5MCI+NC43Ljk8L3RleHQ+PC9nPjx0ZXh0IHg9IjEwNjUiIHk9IjE0MCIgdGV4dExlbmd0aD0iMjkwIj40LjcuOTwvdGV4dD48L2c+PC9nPjwvc3ZnPg==)](https://npmx.dev/package/handlebars)
[![remark](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTEiIGhlaWdodD0iMjAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0icmVtYXJrOiAxNS4wLjEiPjx0aXRsZT5yZW1hcms6IDE1LjAuMTwvdGl0bGU+PGZpbHRlciBpZD0iYmx1ciI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTYiLz48L2ZpbHRlcj48bGluZWFyR3JhZGllbnQgaWQ9InMiIHgyPSIwIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYmJiIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9InIiPjxyZWN0IHdpZHRoPSIxMTEiIGhlaWdodD0iMjAiIHJ4PSIzIi8+PC9jbGlwUGF0aD48ZyBjbGlwLXBhdGg9InVybCgjcikiPjxyZWN0IHdpZHRoPSI2NiIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMDAwMCIvPjxyZWN0IHg9IjY2IiB3aWR0aD0iNDUiIGhlaWdodD0iMjAiIGZpbGw9IiMwMDAwMDAiLz48cmVjdCB3aWR0aD0iMTExIiBoZWlnaHQ9IjIwIiBmaWxsPSJ1cmwoI3MpIi8+PC9nPjxnIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJWZXJkYW5hLEdlbmV2YSxEZWphVnUgU2FucyxzYW5zLXNlcmlmIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBmb250LXNpemU9IjExMCI+PGltYWdlIHg9IjUiIHk9IjMiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgaHJlZj0iZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJK1BIQmhkR2dnWm1sc2JEMGlJMlptWm1abVppSWdaRDBpVFRRdU1qQTBJREU0TGpBNE9WWXhNaTQyTm5Fd0xUSXVORGMzSURFdU1UVTJMVE11T1RRM0lERXVNVFUyTFRFdU5EY2dNeTR4TURndE1TNDBOeTQwT1RRZ01DQXhMakF6TGpBNU1pNDFOQzR3T0RndU9UVXpMakkwTlZZMUxqazNObkV0TGpJM09TMHVNVEl5TFM0M05UUXRMakU1TlMwdU5EYzRMUzR3TnpNdE1TNHdNRGN0TGpBM015MHhMamMySURBdE1pNDVNREl1T0RndE1TNHhORFF1T0RneExURXVORFU0SURJdU5EazNhQzB1TVRVM1ZqWXVNREZJTUhZeExqRTRObWd5TGpjek4xWXhPQzR3T1ZwdExUTXVPVFU1SURCSU9DNHdOSFl0TVM0eE9EZElMakkwTlZwTk1Ua3VNU0EzTGpFd09YRXhMall3TkNBd0lESXVOVEEzSURFdU1EazFMamt3TkNBeExqQTVNUzQ1TURRZ015NHdNa2d4TlM0MmNUQXRNUzQ1TkM0NU15MHpMakF5Tnk0NU15MHhMakE0T0NBeUxqVTJPUzB4TGpBNE9IcHROQzQ0TkRZZ055NDVPVGhvTFRFdU5EVTRjUzB1TWpndU9EZzBMVEV1TVRNeklERXVNemM0TFM0NE5UUXVORGswTFRJdU1EZzNMalE1TkMweExqWTRJREF0TWk0Mk56WXRNUzR4TVRRdExqazVNUzB4TGpFeE9DMHVPVGt4TFRNdU1ERXpkaTB1TkRFMFNESTBkaTB1T1RVemNUQXRNUzQ0TURjdExqVTNPQzB6TGpBM05DMHVOVGMwTFRFdU1qWTNMVEV1TmpjdE1TNDVNek10TVM0d09UUXRMalkzTFRJdU5qVXlMUzQyTnkweExqUTVNeUF3TFRJdU5qRTFMalkxT0MweExqRXhPQzQyTlRVdE1TNDNNemdnTVM0NE16Z3RMall4TnlBeExqRTRNeTB1TmpFM0lESXVOemMxZGpFdU56WXhjVEFnTWk0MU9DQXhMak0xTWlBMExqQXhOaUF4TGpNMU1TQXhMalF6TmlBekxqYzROaUF4TGpRek5pQXhMakl5TVNBd0lESXVNakExTFM0ek9UUXVPVGd0TGpNNUlERXVOakkzTFRFdU1URXVOalF6TFM0M01UY3VPRFEyTFRFdU5qZ3hlaUl2UGp3dmMzWm5QZz09Ii8+PGcgdHJhbnNmb3JtPSJzY2FsZSguMSkiPjxnIGFyaWEtaGlkZGVuPSJ0cnVlIiBmaWxsPSIjMDEwMTAxIj48dGV4dCB4PSI0MjUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuOCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiB0ZXh0TGVuZ3RoPSIzOTAiPnJlbWFyazwvdGV4dD48dGV4dCB4PSI0MjUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iMzkwIj5yZW1hcms8L3RleHQ+PC9nPjx0ZXh0IHg9IjQyNSIgeT0iMTQwIiB0ZXh0TGVuZ3RoPSIzOTAiPnJlbWFyazwvdGV4dD48L2c+PGcgdHJhbnNmb3JtPSJzY2FsZSguMSkiPjxnIGFyaWEtaGlkZGVuPSJ0cnVlIiBmaWxsPSIjMDEwMTAxIj48dGV4dCB4PSI4NzUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuOCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiB0ZXh0TGVuZ3RoPSIzNTAiPjE1LjAuMTwvdGV4dD48dGV4dCB4PSI4NzUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iMzUwIj4xNS4wLjE8L3RleHQ+PC9nPjx0ZXh0IHg9Ijg3NSIgeT0iMTQwIiB0ZXh0TGVuZ3RoPSIzNTAiPjE1LjAuMTwvdGV4dD48L2c+PC9nPjwvc3ZnPg==)](https://npmx.dev/package/remark)
[![simple-icons](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDkiIGhlaWdodD0iMjAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0ic2ltcGxlLWljb25zOiAxNi4xOS4wIj48dGl0bGU+c2ltcGxlLWljb25zOiAxNi4xOS4wPC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjE0OSIgaGVpZ2h0PSIyMCIgcng9IjMiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMTExMTExIi8+PHJlY3QgeD0iOTYiIHdpZHRoPSI1MyIgaGVpZ2h0PSIyMCIgZmlsbD0iIzExMTExMSIvPjxyZWN0IHdpZHRoPSIxNDkiIGhlaWdodD0iMjAiIGZpbGw9InVybCgjcykiLz48L2c+PGcgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IlZlcmRhbmEsR2VuZXZhLERlamFWdSBTYW5zLHNhbnMtc2VyaWYiIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGZvbnQtc2l6ZT0iMTEwIj48aW1hZ2UgeD0iNSIgeT0iMyIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiBocmVmPSJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSFpwWlhkQ2IzZzlJakFnTUNBeU5DQXlOQ0krUEhCaGRHZ2dabWxzYkQwaUkyWm1abVptWmlJZ1pEMGlUVEU0SURaaE5pQTJJREFnTVRBdE5pQTJJRFlnTmlBd0lEQXhOUzR6TlNBNWFERXVOVUUzTGpVZ055NDFJREFnTURBeE1pQXhNQzQxSURRdU5TQTBMalVnTUNBeE1URTJMalVnTmxwdExUWXRNMkV6SURNZ01DQXdNREFnTmlBeElERWdNQ0F3TURBdE5tMHdJREV1TldFeExqVWdNUzQxSURBZ01ERXdJRE1nTVNBeElEQWdNREV3TFROTk55NDFJREUxZGpFdU5VZzVkalpJTkM0MVZqSTBhREUxZGkweExqVklNVFYyTFRab01TNDFWakUxV20weklERXVOV2d6ZGpab0xUTjZiUzAySURFdU5XRTNMalVnTnk0MUlEQWdNREF1TnlBemFERXVOV0UySURZZ01DQXdNUzB1TnkweldpSXZQand2YzNablBnPT0iLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjU3NSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjY5MCI+c2ltcGxlLWljb25zPC90ZXh0Pjx0ZXh0IHg9IjU3NSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSI2OTAiPnNpbXBsZS1pY29uczwvdGV4dD48L2c+PHRleHQgeD0iNTc1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjY5MCI+c2ltcGxlLWljb25zPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjEyMTUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuOCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiB0ZXh0TGVuZ3RoPSI0MzAiPjE2LjE5LjA8L3RleHQ+PHRleHQgeD0iMTIxNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSI0MzAiPjE2LjE5LjA8L3RleHQ+PC9nPjx0ZXh0IHg9IjEyMTUiIHk9IjE0MCIgdGV4dExlbmd0aD0iNDMwIj4xNi4xOS4wPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/simple-icons)
[![yaml](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5MyIgaGVpZ2h0PSIyMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJ5YW1sOiAyLjguMiI+PHRpdGxlPnlhbWw6IDIuOC4yPC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjkzIiBoZWlnaHQ9IjIwIiByeD0iMyIvPjwvY2xpcFBhdGg+PGcgY2xpcC1wYXRoPSJ1cmwoI3IpIj48cmVjdCB3aWR0aD0iNTQiIGhlaWdodD0iMjAiIGZpbGw9IiNjYjE3MWUiLz48cmVjdCB4PSI1NCIgd2lkdGg9IjM5IiBoZWlnaHQ9IjIwIiBmaWxsPSIjY2IxNzFlIi8+PHJlY3Qgd2lkdGg9IjkzIiBoZWlnaHQ9IjIwIiBmaWxsPSJ1cmwoI3MpIi8+PC9nPjxnIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJWZXJkYW5hLEdlbmV2YSxEZWphVnUgU2FucyxzYW5zLXNlcmlmIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBmb250LXNpemU9IjExMCI+PGltYWdlIHg9IjUiIHk9IjMiIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgaHJlZj0iZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhacFpYZENiM2c5SWpBZ01DQXlOQ0F5TkNJK1BIQmhkR2dnWm1sc2JEMGlJMlptWm1abVppSWdaRDBpYlRBZ0xqazNJRFF1TVRFeElEWXVORFV6ZGpRdU1EbG9NaTQyTXpoMkxUUXVNRGxNTVRFdU1EVXpMamsyT1VnNExqSXhORXcxTGpVNElEVXVNVEkxSURJdU9UWTFMamsyT1ZwdE1USXVNRGt6TGpBeU5DMDBMalEzSURFd0xqVTBOR2d5TGpFeE5Hd3VPVGN0TWk0ek5EVm9OQzQzTnpWc0xqZ3dOQ0F5TGpNME5XZ3lMakkyVERFMExqSTFOUzQ1T1RSYWJURXVNVE16SURJdU1qSTFJREV1TkRZeklETXVPRGRvTFRNdU1EazJlbTB6TGpBMklEa3VORGMxZGpFd0xqSTVTREkwZGkweUxqRTVPV2d0TlM0ME5UUjJMVGd1TURreGVtMHRNVEl1TVRjMUxqQXdNbll4TUM0ek16Vm9NaTR5TVRkMkxUY3VNVEk1YkRJdU16SWdOQzQzT1RKb01TNDNORFpzTWk0MExUUXVPVFoyTnk0eU9UVm9NaTR4TWpkV01USXVOamsyYUMweUxqa3dORXc1TGpRMElERTNMak0zYkMweUxqUTFOUzAwTGpZM05Gb2lMejQ4TDNOMlp6ND0iLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjM2NSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjI3MCI+eWFtbDwvdGV4dD48dGV4dCB4PSIzNjUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iMjcwIj55YW1sPC90ZXh0PjwvZz48dGV4dCB4PSIzNjUiIHk9IjE0MCIgdGV4dExlbmd0aD0iMjcwIj55YW1sPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjcyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjI5MCI+Mi44LjI8L3RleHQ+PHRleHQgeD0iNzI1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjI5MCI+Mi44LjI8L3RleHQ+PC9nPjx0ZXh0IHg9IjcyNSIgeT0iMTQwIiB0ZXh0TGVuZ3RoPSIyOTAiPjIuOC4yPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/yaml)
[![zod](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NSIgaGVpZ2h0PSIyMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJ6b2Q6IDQuMi4xIj48dGl0bGU+em9kOiA0LjIuMTwvdGl0bGU+PGZpbHRlciBpZD0iYmx1ciI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTYiLz48L2ZpbHRlcj48bGluZWFyR3JhZGllbnQgaWQ9InMiIHgyPSIwIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjYmJiIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9Ii4xIi8+PC9saW5lYXJHcmFkaWVudD48Y2xpcFBhdGggaWQ9InIiPjxyZWN0IHdpZHRoPSI4NSIgaGVpZ2h0PSIyMCIgcng9IjMiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9IjQ2IiBoZWlnaHQ9IjIwIiBmaWxsPSIjNDA4YWZmIi8+PHJlY3QgeD0iNDYiIHdpZHRoPSIzOSIgaGVpZ2h0PSIyMCIgZmlsbD0iIzQwOGFmZiIvPjxyZWN0IHdpZHRoPSI4NSIgaGVpZ2h0PSIyMCIgZmlsbD0idXJsKCNzKSIvPjwvZz48ZyBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iVmVyZGFuYSxHZW5ldmEsRGVqYVZ1IFNhbnMsc2Fucy1zZXJpZiIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgZm9udC1zaXplPSIxMTAiPjxpbWFnZSB4PSI1IiB5PSIzIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGhyZWY9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSStQSEJoZEdnZ1ptbHNiRDBpSTJabVptWm1aaUlnWkQwaVRUSXVOVGcwSURNdU5UZ3lZVEl1TWpRM0lESXVNalEzSURBZ01DQXhJREl1TVRFeUxURXVORGM1YURFMExqWXhOMk11T1RRNElEQWdNUzQzT1RRdU5UazFJREl1TVRFMUlERXVORGczYkRJdU5EUWdOaTQzTnpkaE1pNHlORGdnTWk0eU5EZ2dNQ0F3SURFdExqWXlOQ0F5TGpRME0yd3RPUzQyTVNBNExqVXlZVEl1TWpRM0lESXVNalEzSURBZ01DQXhMVEl1T1RZekxqQXhPRXd1TnpjMklERXlMamMzTTJFeUxqSTBPQ0F5TGpJME9DQXdJREFnTVMwdU5qUXRNaTQwTmpkYWJURXlMakF6T0NBMExqZzROeTA1TGpFeElEVXVOVE0zSURVdU56UWdOUzR3TURkakxqUTFOaTR6T1RrZ01TNHhNemt1TXprMklERXVOVGt6TFM0d01EWnNOUzQyTkRNdE5TNHdNREZJTVRRdU5HdzJMakl6T1MwekxqazFOMk11TkRnNExTNHpNamd1TmprdExqazBOeTQwT1RFdE1TNDFiQzB4TGpJMExUTXVORFEyWVRFdU5UTTFJREV1TlRNMUlEQWdNQ0F3TFRFdU5EVTJMVEV1TURFMVNEVXVOVFExWVRFdU5UTTFJREV1TlRNMUlEQWdNQ0F3TFRFdU5ETXhJREV1TURGc0xURXVNakk0SURNdU16ZDZJaTgrUEM5emRtYysiLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjMyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjE5MCI+em9kPC90ZXh0Pjx0ZXh0IHg9IjMyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSIxOTAiPnpvZDwvdGV4dD48L2c+PHRleHQgeD0iMzI1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjE5MCI+em9kPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjY0NSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjI5MCI+NC4yLjE8L3RleHQ+PHRleHQgeD0iNjQ1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjI5MCI+NC4yLjE8L3RleHQ+PC9nPjx0ZXh0IHg9IjY0NSIgeT0iMTQwIiB0ZXh0TGVuZ3RoPSIyOTAiPjQuMi4xPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/zod)
[![@tanstack/intent](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjciIGhlaWdodD0iMjAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iQHRhbnN0YWNrL2ludGVudDogMC4wLjQxIj48dGl0bGU+QHRhbnN0YWNrL2ludGVudDogMC4wLjQxPC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjE2NyIgaGVpZ2h0PSIyMCIgcng9IjMiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9IjEyMiIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwYTZmNCIvPjxyZWN0IHg9IjEyMiIgd2lkdGg9IjQ1IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDBhNmY0Ii8+PHJlY3Qgd2lkdGg9IjE2NyIgaGVpZ2h0PSIyMCIgZmlsbD0idXJsKCNzKSIvPjwvZz48ZyBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iVmVyZGFuYSxHZW5ldmEsRGVqYVZ1IFNhbnMsc2Fucy1zZXJpZiIgdGV4dC1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiIgZm9udC1zaXplPSIxMTAiPjxpbWFnZSB4PSI1IiB5PSIzIiB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGhyZWY9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEhOMlp5QjRiV3h1Y3owaWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1jaUlIWnBaWGRDYjNnOUlqQWdNQ0F5TkNBeU5DSStQSEJoZEdnZ1ptbHNiRDBpSTJabVptWm1aaUlnWkQwaVRURXhMakEzT0M0d05ESmpMak14TmkwdU1EUXlMalkxTFM0d01UUXVPVGN0TGpBeE5DQXhMakU0TVNBd0lESXVNelF4TGpFNE5DQXpMalEzTWk0MU16SmhNVEl1TXlBeE1pNHpJREFnTUNBeElETXVPVGN6SURJdU1EZzJJREV4TGprZ01URXVPU0F3SURBZ01TQXpMalF6TWlBMExqTXpZekV1TkRRMklETXVNVFVnTVM0ME16WWdOaTQ1TnkwdU1EUTJJREV3TGpFd055MHVPVFU0SURJdU1ESTVMVEl1TkRrMUlETXVOekkzTFRRdU16VTJJRFF1T1RZMUxURXVOVEU0SURFdU1ERXRNeTR5T1RNZ01TNDJNamt0TlM0eElERXVPRFE0TFRJdU1qazRMakkzT1MwMExqYzROQzB1TVRJNUxUWXVPRFV0TVM0eE9EZ3RNeTQ0T0MweExqazVMVFl1TlRFNExUVXVPVGswTFRZdU5UY3RNVEF1TXpneUxTNHdNUzB1T0RRMkxqQXdNeTB4TGpZNU55NHhOeTB5TGpVek5DNHlOek10TVM0ek5qVXVOelE0TFRJdU5qZ3pJREV1TkRZekxUTXVPRGhoTVRJZ01USWdNQ0F3SURFZ01pNDVOall0TXk0ek5rRXhNaTR6SURFeUxqTWdNQ0F3SURFZ09TNHpOVGN1TTJFeE1pQXhNaUF3SURBZ01TQXhMakkxTlMwdU1td3VNVE16TFM0d01UWjZUVGN1TURZMElERTVMams1WXkwdU5UTTFMakExTnkweExqQTVPQzR4TlRRdE1TNDFOVGN1TkRVMExqRXdNeTR3TWpVdU1qSXlJREFnTGpNeklEQWdMakkxT0NBd0lDNDFNaTB1TURFdU56YzRMakF3TWk0Mk5EY3VNREk0SURFdU16SXVNVE14SURFdU9UUTFMak13TXk0NExqSXlJREV1TlRBMUxqWTFJREl1TWpjMUxqazBNaTQ0TVRNdU16QTNJREV1TmpJeUxqUXdNaUF5TGpRNE5DNDBNREl1TkRNMUlEQWdMamcyTmkwdU1EQXhJREV1TWpnM0xTNHhNaTB1TWpJdExqRXhOeTB1TlRNMExTNHdPVFV0TGpjM09DMHVNVFEwWVRFeElERXhJREFnTUNBeExURXVOVFUyTFM0ME1UWWdNVElnTVRJZ01DQXdJREV0TVM0d09UTXRMalEyTjJ3dExqSXpMUzR4TURoaE1UVWdNVFVnTUNBd0lEQXRNUzR3TVRJdExqUTBZeTB1T1RBMUxTNHpORE10TVM0NU1EZ3RMalV4TWkweUxqZzNNeTB1TkRBNGJTNDRNRGd0TWk0eU56UmpMVEV1TURVNUlEQXRNaTR4TXk0eE9EY3RNeTR3T0RNdU5qWTNjUzB1TXpRMkxqRTNOeTB1TmpVNUxqUXhZeTB1TURZekxqQTBOaTB1TVRjMUxqRXdOaTB1TVRrNUxqRTRPSE11TURZeExqRTFNUzR4TVM0eU1EUmpMakl6T0MwdU1USTNMalEyTkMwdU1qWXhMamN4T0MwdU16VTNJREV1TmpRdExqWXlOQ0F6TGpZekxTNDBPVE1nTlM0eU5qZ3VNRGM0TGpneE55NHlPRFVnTVM0MU5qa3VOekV5SURJdU16WTFJREV1TURRMkxqZzVMak0zTkNBeExqYzVPQzQyTVRZZ01pNDNOVE11TnpRZ01TNHhNamN1TVRRM0lESXVOREV5TGpBeU9DQXpMalEwTWkwdU5EZ3VNell5TFM0eE56a3VPRFkxTFM0ME5URWdNUzR3TVRndExqZzBOeTB1TVRnNUxqQXhOeTB1TXpZdU1EazRMUzQxTXprdU1UVTBZVGtnT1NBd0lEQWdNUzB1T0RZNExqSXlNbU10TGprNU5DNHlMVEl1TURVeUxqSTBMVE11TURVekxqQTJMUzQ1TkRNdExqRTNMVEV1T0RJdExqVXhNeTB5TGpZNU15MHVPRGN6YkMwdU1URXhMUzR3TkRZdExqSXlNeTB1TURreUxTNHhNVEl0TGpBME5tRXlOaUF5TmlBd0lEQWdNQzB4TGpNMUxTNDFNamRqTFM0NE9TMHVNekV0TVM0NE5ESXRMalV0TWk0M09EUXRMalZOT1M0M01qZ2dNUzQwTlRKakxURXVNamN1TWpndE1pNDBNRGN1T0RJMkxUTXVOVEF5SURFdU5URTBMUzQyTXpjdU5DMHhMakkwTlM0NE1TMHhMamM1TmlBeExqTXlNeTB1T0RJdU56WTFMVEV1TkRRM0lERXVOamsxTFRFdU9Ua3pJREl1TmpZMkxTNDFOak1nTVMwdU9USTBJREl1TVRZMkxURXVNRGs0SURNdU1qazNMUzR4TnpJZ01TNHhNUzB1TWlBeUxqSTNOeTB1TURBMElETXVNemc0TGpJME5TQXhMak00T0M0M01USWdNaTQyT1RFZ01TNDBORGdnTXk0NE9UY3VNalE0TFM0eE1UWXVOREkwTFM0ek9DNDJNamt0TGpVMU55NDBNVFF0TGpNMU9TNDROUzB1TmpreElERXVNekUzTFM0NU56aGhNeTQxSURNdU5TQXdJREFnTVNBdU5UTTVMUzR5TmpSakxqQTNMUzR3TWprdU1UZzNMUzR3TlRVdU1qSXRMakV6TWk0d05UTXRMakV5TkMwdU1EUTFMUzR6TkMwdU1EWXlMUzQwTmpoaE55QTNJREFnTUNBeExTNHdOamd0TVM0eE1Ea2dPUzQzSURrdU55QXdJREFnTVNBdU5qRXRNeTR4TnpkakxqSTVMUzQzTmk0M015MHhMalExSURFdU1qVTBMVEl1TURZNUxqRTNOeTB1TWpFdU16WTFMUzQwTURVdU5UWXRMall1TVRFMUxTNHhNVFF1TWpVNExTNHlNVEl1TXpNdExqTTFPUzB1TXpjMklEQXRMamMxTVM0eE1EZ3RNUzR4TURndU1qRTRMUzQzTmprdU1qTTNMVEV1TlRFNExqVTRPQzB5TGpFMU5TQXhMakE0TkMwdU1qa3hMakl5TmkwdU5UQTBMalV5TWkwdU56YzVMamMyTFM0d09EUXVNRGN6TFM0eU16VXVNVGN0TGpNMU1pNHhNVFl0TGpFM05pMHVNRGd6TFM0eE5Ea3RMalF6TFM0eE5qa3RMalU1TFM0d056Z3RMall4TWk0eE5UUXRNUzR6T0RjdU5EVXRNUzQ1TVRndU5EY3pMUzQ0TlRJZ01TNHpORGd0TVM0MU9DQXlMak0zTmkweExqVTFOUzQwTkRRdU1ERXhMamd6TXk0eE5qWWdNUzR5TlRjdU1qWTJMUzR4TURjdExqRTFNeTB1TWpVeUxTNHlOalF0TGpNNE9TMHVNemxoTlM0MElEVXVOQ0F3SURBZ01DMHhMakV3TnkwdU9HTXRMakUyTXkwdU1EZzFMUzR6TXpndExqRXpOaTB1TlRBNUxTNHlMUzR3T0RZdExqQXpMUzR4T1RVdExqQTNOQzB1TWpJM0xTNHhOeTB1TURZdExqRTNOeTR5TmkwdU16UXlMak0zTnkwdU5ERTNMalExTXkwdU1qZzVJREV1TURFdExqVXlOeUF4TGpVMU5pMHVOVFF1T0RVMExTNHdNakVnTVM0Mk9EZ3VORFV5SURJdU1EUWdNUzR5TlRndU1USXpMakk0TkM0eE5pNDFPRE11TVRnMExqZzROV3d1TURBMExqQTFOeTR3TURZdU1EZzFMakF3TWk0d01qa3VNREExTGpBMU55NHdNRFF1TURVMll5NHlOamd0TGpJeE9DNDBOVGN0TGpVMExqY3hPQzB1TnpjMExqWXhNaTB1TlRRM0lERXVORFV0TGpjNUlESXVNalExTFM0MU5EUmhNaTQ1TnlBeUxqazNJREFnTUNBeElERXVOekVnTVM0ek56aGpMakE1Tnk0eE56TXVNelkxTGpVNU5TNHhOekV1TnpZM0xTNHhOVEl1TVRNMExTNHpORFF1TURNdExqVXdOQzB1TURJMllUTWdNeUF3SURBZ01DMHVNemN5TFM0d09UUnNMUzR3TmpndExqQXhOQzB1TURZNUxTNHdNVE5oTXk0NUlETXVPU0F3SURBZ01DMHhMak0zTnkwdU1EQXlZeTB1TWpneUxqQTFMUzQxTlRjdU1UVXRMamd6T0M0eE9USjJMakEyWXk0M05qZ3VNREEySURFdU5URXVORFEwSURFdU9Ea2dNUzR4TURrdU1UVTNMakkzTlM0eU16VXVOVGt1TWprMUxqa3VNRGMxTGpNNExqQXlNaTQzT1RZdExqQTRNaUF4TGpFMk9DMHVNRE0xTGpFeU5TMHVNRGs0TGpNek5pMHVNalEzTGpNMk5TMHVNVEEyTGpBeUxTNHhPVFV0TGpBNE5TMHVNalUyTFM0eE5UVmhOQzQySURRdU5pQXdJREFnTUMwdU5Ea3lMUzQxTWpJZ01qQWdNakFnTUNBd0lEQXRNUzQwTmpjdE1TNHhOR010TGpJMk55MHVNVGt0TGpVMkxTNDBOQzB1T0RZNExTNDFOVFl1TURnM0xqSXdPQzR4TnpFdU5EQXlMakl1TmpNdU1EZzRMalkyTnkwdU1Ua3lJREV1TWprMkxTNDJNVElnTVM0M09UaGhNaTQySURJdU5pQXdJREFnTVMwdU5ESTJMalF5TjJNdExqQTJOeTR3TlMwdU1UVXhMakV4TkMwdU1qUXVNUzB1TWpjM0xTNHdORFF0TGpNeExTNDBOak10TGpNMU15MHVOamMzTFM0eE5EUXRMamN5TmkwdU1EZzJMVEV1TkRRM0xqRXhOQzB5TGpFMU9DMHVNVGM0TGpBNUxTNHpNRGN1TWpnM0xTNDBNVGd1TkRWaE5TNHpJRFV1TXlBd0lEQWdNQzB1TmpFeUlERXVNVE00WXkwdU5qRWdNUzQyTVRjdExqWXdOQ0F6TGpVeExqRTROaUExTGpBMk5pNHdPRGd1TVRjMExqSXlNUzR4TlM0ek9UVXVNVFZvTGpFMU4yRXpJRE1nTUNBd0lERWdMalEzTWk0d01UaGpMakE0TGpBeExqRTVNeUF3SUM0eU5UY3VNRFl1TURjM0xqQTNNaTR3TXpZdU1UazBMakF4T0M0eU9ESXRMakExTGpJME5pMHVNRFkyTGpRMk9TMHVNRFkyTGpjeUxqTXlPQzB1TURVeExqUXhPUzB1TlRjMkxqVXpOUzB1T0RRdU1UTXhMUzR5T1RndU1qWTFMUzQxT1RjdU16ZzNMUzQ1TGpBMkxTNHhORGd1TVRRdExqTXhOQzR4TVRrdExqUTNPUzB1TURJMExTNHhPRFV0TGpFMU55MHVNemd4TFM0eU5TMHVOVFF0TGpFM055MHVNams0TFM0ek56Z3RMall3TmkwdU5UQTRMUzQ1TWprdExqRXdOQzB1TWpVNExTNHdNRGN0TGpVNExqSTROaTB1TmpjeUxqRTJNUzB1TURVdU16TTBMakEwT1M0ME16a3VNVFkyTGpJeUxqSTBOQzR6TmpNdU5qQTVMalV5TXk0NE9UWnNNUzR5TkRrZ01pNHlORGh4TGpFMU9TNHlPRFl1TXpJdU5UZGpMakEwTXk0d056UXVNRGcyTGpFNE9DNHhOek11TWpFNUxqQTNOeTR3TWpndU1UZ3lMUzR3TVRJdU1qWXRMakF5Tnk0eE9UZ3RMakEwTGpNNU9DMHVNRGd6TGpVNU9DMHVNVEl1TWpRdExqQTBNeTQyTURVdExqQXpOUzQzTnpndExqSXlNaTB1TWpVekxTNHdPQzB1TlRRMUxTNHdOelV0TGpnd09DMHVNRFUzTFM0eE5UZ3VNREV0TGpNek15NHdOamN0TGpRM09TMHVNREkxTFM0eU1UWXRMakV6TnkwdU16WXRMalExTlMwdU5Ea3lMUzQyTmpjdExqTXlOaTB1TlRJMUxTNDJNek10TVM0d05UY3RMamswTlMweExqVTViQzB1TURVdExqQTROQzB1TVMwdU1UZHhMUzR3TnpVdExqRXlOaTB1TVRRNUxTNHlOVFZqTFM0d016Y3RMakEyTmkwdU1Ea3lMUzR4TlRNdExqQXpPUzB1TWpJM0xqQTFOaTB1TURjMkxqRTNPUzB1TURndU1qa3RMakE0TVdndU1ESXhjUzR3TmpZdU1EQXhMakV4TnkwdU1EQTBZVEV3SURFd0lEQWdNQ0F4SURFdU16UTNMUzR4TURkakxTNHdNelV0TGpFeU1pMHVNVE0xTFM0eU5pMHVNVEF6TFM0ek9TNHdOekV0TGpJNU1pNDBPUzB1TXpnekxqWTROaTB1TVRjMExqRXpNUzR4TkM0eU1EY3VNek0wTGpJNU1pNDFNRFF1TVRFekxqSXlNeTR5TkM0ME5DNHpOakV1TmpZdU1qRXhMak00TXk0ME5ERXVOelUzTGpZMU9DQXhMakV6T0d3dU1EVTFMakE1TkM0d01qZ3VNRFEzWXk0d09UTXVNVFUyTGpFNE55NHpNVFF1TWpNNExqUTRPUzB1TnpVekxTNHdNelV0TVM0ek1UZ3RMamt3T1MweExqWTBOaTB4TGpRNU9TMHVNREkzTGpBNU5TNHdNVFl1TVRjNUxqQTFMakkzY1M0eE1ETXVNamd5TGpJMk1pNDFOR011TVRVeUxqSTBOQzR6TWpZdU5EazFMalUxTmk0Mk56TXVOREE0TGpNeE5TNDVORFV1TXpFM0lERXVORE0yTGpJNE15NHpNVFV0TGpBeU1pNDNNRGd0TGpFMk5TQXhMakF4T0MwdU1EWTRjeTQwTXpRdU5ETTRMakkxTGpkakxTNHhNemd1TVRrMkxTNHpNakV1TWpjdExqVTFMak11TVRZeUxqTTBOaTR6TnpNdU5qWTNMalV5TnlBeExqQXlMakEyTkM0eE5EWXVNVE11TXpjdU1qZ3pMalEwT0M0eE1ESXVNRFV4TGpJME9DNHdNRE11TXpVNElEQXRMakV4TFM0eU9USXRMak14TnkwdU5UUXRMalF4T1MwdU9ETTVMak14TGpBeE5TNDJNUzR4TnpZdU9EazRMakk0TGpVMk55NHlNRElnTVM0eE1qZ3VOREkwSURFdU5qZzNMalkwT0d3dU1qVTRMakV3TkdNdU1qTXVNRGt5TGpRMk1pNHhPRE11TmpnNUxqSTRNeTR3T0RNdU1ETTNMakU1T0M0eE1qTXVNamt1TURjdU1EYzBMUzR3TkRNdU1USXpMUzR4TkRZdU1UWTVMUzR5TVRWaE1UQXVNeUF4TUM0eklEQWdNQ0F3SURFdU16a3pMVE11TWpBNFl5NDNOUzB5TGprNE9TNHhNRFl0Tmk0eU9EY3RNUzQyT1RVdE9DNDNPRE10TGpZNU1pMHVPVFl0TVM0MU5qSXRNUzQzT0RrdE1pNDFNakl0TWk0ME56WXRNaTQwTURFdE1TNDNNVGd0TlM0MU5URXRNaTQwTURjdE9DNDBOQzB4TGpjMk9HMDBMamt3T0NBeE5DNDVNRFJqTFM0Mk16WXVNVFkyTFRFdU1qa3lMak14TnkweExqazBOUzQwTURFdU1EZzJMakk1TXk0eU9UWXVOVGMzTGpRMUxqZzBMakExT1M0eE1ERXVNVEl5TGpJek55NHlOQzR5T0RFdU1UTXlMakExTGpJNU1pMHVNRE11TkRFM0xTNHdOekl0TGpBMU9DMHVNVFU0TFM0eE5UVXRMak10TGpJek5TMHVORFV0TGpBek15MHVNRFl0TGpBNE5DMHVNVE16TFM0d05UWXRMakl3Tmk0d05TMHVNVE0zTGpJMk15MHVNVE11TXpneExTNHhOVE11TXpFdExqQTJNeTQyTVRjdExqRTBNaTQ1TWpndExqSXdOQzR4TVRRdExqQXlNeTR5TnpRdExqQTROUzR6T0RrdExqQTBOeTR3T0RZdU1ETXVNVE00TGpFdU1UZzNMakUzTkd3dU1ESXlMakF6TTNFdU1EUXpMakEzTGpBNU55NHhNakpqTGpFeU5TNHhNVE11TXpFekxqRXpMalEzTWk0eE5qSXRMakE1TnkwdU1qRTVMUzR5TlRrdExqUXhMUzR6TmpJdExqWXpMUzR3TmkwdU1USTNMUzR4TVMwdU16RTFMUzR5TkRJdExqTTRPQzB1TVRneUxTNHhNREl0TGpVMU55NHdPRGt0TGpjME15NHhNemR0TFRRdU1ERXRNUzQwTlRkakxTNHdNeTR6T0MwdU1UUTNMalk0T1MwdU16TWdNUzR3TVRrdU1qRXVNREkyTGpReU15NHdNell1TmpJNUxqQTROeTR4TlRRdU1ETTRMakk1Tmk0eE1TNDBORGt1TVRVekxTNHdPREl0TGpJeU5DMHVNak16TFM0ME1qTXRMak0xTFM0Mk15MHVNVEl0TGpJd09DMHVNakkyTFM0ME5qSXRMak01T0MwdU5qTWlMejQ4TDNOMlp6ND0iLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjcwNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9Ijk1MCI+QHRhbnN0YWNrL2ludGVudDwvdGV4dD48dGV4dCB4PSI3MDUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iOTUwIj5AdGFuc3RhY2svaW50ZW50PC90ZXh0PjwvZz48dGV4dCB4PSI3MDUiIHk9IjE0MCIgdGV4dExlbmd0aD0iOTUwIj5AdGFuc3RhY2svaW50ZW50PC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjE0MzUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuOCIgZmlsdGVyPSJ1cmwoI2JsdXIpIiB0ZXh0TGVuZ3RoPSIzNTAiPjAuMC40MTwvdGV4dD48dGV4dCB4PSIxNDM1IiB5PSIxNTAiIGZpbGwtb3BhY2l0eT0iLjMiIHRleHRMZW5ndGg9IjM1MCI+MC4wLjQxPC90ZXh0PjwvZz48dGV4dCB4PSIxNDM1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjM1MCI+MC4wLjQxPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/@tanstack/intent)
[![tsdown](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTkiIGhlaWdodD0iMjAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0idHNkb3duOiAwLjIxLjEwIj48dGl0bGU+dHNkb3duOiAwLjIxLjEwPC90aXRsZT48ZmlsdGVyIGlkPSJibHVyIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxNiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icyIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iciI+PHJlY3Qgd2lkdGg9IjExOSIgaGVpZ2h0PSIyMCIgcng9IjMiLz48L2NsaXBQYXRoPjxnIGNsaXAtcGF0aD0idXJsKCNyKSI+PHJlY3Qgd2lkdGg9IjY2IiBoZWlnaHQ9IjIwIiBmaWxsPSIjMzE3OGM2Ii8+PHJlY3QgeD0iNjYiIHdpZHRoPSI1MyIgaGVpZ2h0PSIyMCIgZmlsbD0iIzMxNzhjNiIvPjxyZWN0IHdpZHRoPSIxMTkiIGhlaWdodD0iMjAiIGZpbGw9InVybCgjcykiLz48L2c+PGcgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IlZlcmRhbmEsR2VuZXZhLERlamFWdSBTYW5zLHNhbnMtc2VyaWYiIHRleHQtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iIGZvbnQtc2l6ZT0iMTEwIj48aW1hZ2UgeD0iNSIgeT0iMyIgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiBocmVmPSJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSFpwWlhkQ2IzZzlJakFnTUNBeU5DQXlOQ0krUEhCaGRHZ2dabWxzYkQwaUkyWm1abVptWmlJZ1pEMGlUVEl4TGpZMU1pQXdZeTQxTVRRZ01DQXVOemsyTGpZdU5EWTJMams1T0d3dE5TNDJNVFlnTmk0M05HTXRMalkyTWk0M09UTXRMakE1T0NBeExqazVOeTQ1TXpRZ01TNDVPVGRvTlM0ME16TmpMalV4TmlBd0lDNDNPVGN1Tmk0ME5qY3VPVGs0VERFeUxqUTJOeUF5TXk0M056VmhMall1TmlBd0lEQWdNUzB1TkRZNExqSXlOUzQyTGpZZ01DQXdJREV0TGpRMk9DMHVNakkxVEM0Mk5qRWdNVEF1TnpNellTNDJNRGt1TmpBNUlEQWdNQ0F4SUM0ME5qZ3RMams1T0VnMkxqVTJZekV1TURNeUlEQWdNUzQxT1RVdE1TNHlNRFF1T1RNM0xURXVPVGszVERFdU9EZ3VPVGs0UVM0Mk1EZ3VOakE0SURBZ01DQXhJREl1TXpRMklEQmFJaTgrUEM5emRtYysiLz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjQyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjM5MCI+dHNkb3duPC90ZXh0Pjx0ZXh0IHg9IjQyNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii4zIiB0ZXh0TGVuZ3RoPSIzOTAiPnRzZG93bjwvdGV4dD48L2c+PHRleHQgeD0iNDI1IiB5PSIxNDAiIHRleHRMZW5ndGg9IjM5MCI+dHNkb3duPC90ZXh0PjwvZz48ZyB0cmFuc2Zvcm09InNjYWxlKC4xKSI+PGcgYXJpYS1oaWRkZW49InRydWUiIGZpbGw9IiMwMTAxMDEiPjx0ZXh0IHg9IjkxNSIgeT0iMTUwIiBmaWxsLW9wYWNpdHk9Ii44IiBmaWx0ZXI9InVybCgjYmx1cikiIHRleHRMZW5ndGg9IjQzMCI+MC4yMS4xMDwvdGV4dD48dGV4dCB4PSI5MTUiIHk9IjE1MCIgZmlsbC1vcGFjaXR5PSIuMyIgdGV4dExlbmd0aD0iNDMwIj4wLjIxLjEwPC90ZXh0PjwvZz48dGV4dCB4PSI5MTUiIHk9IjE0MCIgdGV4dExlbmd0aD0iNDMwIj4wLjIxLjEwPC90ZXh0PjwvZz48L2c+PC9zdmc+)](https://npmx.dev/package/tsdown)

<!-- BADGE end -->

</div>

Generate lists and tables for your README automagically based on your repository

##### Table of contents

<details><summary>Open Table of contents</summary>

- [Installation](#installation)
- [Usage](#usage)
- [CLI Options](#cli-options)
- [Configuration](#configuration)
  - [Configuration File](#configuration-file)
    - [JSON Example](#json-example)
    - [YAML Example](#yaml-example)
    - [JavaScript Example](#javascript-example)
    - [TypeScript Example](#typescript-example)
  - [Ignoring files](#ignoring-files)
  - [Schema](#schema)

</details>

## Installation

```sh
pnpm install @stephansama/auto-readme
```

## Usage

In order to run the script you need to do two things

1. Create either a heading or a comment to enable the corresponding feature
2. Run the following command:

```sh
pnpx @stephansama/auto-readme [options]
```

To turn on table of content enable the setting `enableToc` and add the following header

```md
## Table of contents
```

To turn on the usage generator enable the setting `enableUsage` and add the following header

```md
## Usage
```

To use the zod generator add the following comments

```md
<!-- ZOD path="./path/to/zod.js" start -->
<!-- ZOD end -->
```

To generate badges for your dependencies add the following comments

```md
<!-- BADGE start -->
<!-- BADGE end -->
```

If an MCP configuration file or a `skills-lock.json` file lives next to the `README`, the badge section automatically adds a badge for every MCP server and a badge linking to every skill underneath the dependency badges. MCP badges show only the MCP logo next to the server name and link to the host of the server `url` (scheme and domain only, never the endpoint path, credentials or query string); `args`, `env` and `headers` are never rendered. Skill badges show only the Vercel logo (the lock file is written by Vercel's `skills` CLI) next to the skill name and link to the `SKILL.md` at the installed `ref` (or `HEAD`).

The following MCP configuration files are discovered relative to the `README`. Every file found is merged, and when a server name repeats the file listed first wins:

| File                         | Tool                     |
| :--------------------------- | :----------------------- |
| `.mcp.json`                  | Claude Code              |
| `.claude-plugin/plugin.json` | Claude Code plugins      |
| `.cursor/mcp.json`           | Cursor                   |
| `.vscode/mcp.json`           | VS Code / GitHub Copilot |
| `.gemini/settings.json`      | Gemini CLI               |
| `.roo/mcp.json`              | Roo Code                 |
| `.kiro/settings/mcp.json`    | Kiro                     |
| `.amazonq/mcp.json`          | Amazon Q Developer       |
| `opencode.json` / `.jsonc`   | OpenCode                 |
| `.zed/settings.json`         | Zed                      |

> [!NOTE]
> Only JSON based configuration files are read. TOML based files such as `.codex/config.toml` (OpenAI Codex) and YAML based files such as `.continue/config.yaml` (Continue) are intentionally not supported.

A group with more than 8 badges is wrapped in a collapsed `<details>` block whose summary is a badge showing the group logo, name and count. Change the threshold with `collapse=<n>` on the comment:

```md
<!-- BADGE collapse=20 start -->
<!-- BADGE end -->
```

Pass `--skip-mcp` or `--skip-skills` on the comment to opt out:

```md
<!-- BADGE --skip-mcp --skip-skills start -->
<!-- BADGE end -->
```

There are more [Actions](#actions) that you can use in conjunction with different [languages](#language) and [formats](#formats) like so:

```md
<!-- JS-WORKSPACE-TABLE start -->
<!-- JS-WORKSPACE-TABLE end -->
```

You can run `auto-readme` as a pre-commit git hook to automatically keep your `README`s up to date. For example, you can use `husky` to add the following to your `.husky/pre-commit` file:

```sh
auto-readme -g
```

This will run `auto-readme` only when affected `README` files are changed

## CLI Options

| Option      | Alias | Description                                   | Type      | Default |
| :---------- | :---- | :-------------------------------------------- | :-------- | :------ |
| `--changes` | `-g`  | Check only changed git files                  | `boolean` | `false` |
| `--check`   | `-k`  | Do not write to files. Only check for changes | `boolean` | `false` |
| `--config`  | `-c`  | Path to config file                           | `string`  |         |
| `--verbose` | `-v`  | whether or not to display verbose logging     | `boolean` | `false` |

Most of the options in the [schema](#schema) below can also be used as command-line flags.

## Configuration

`auto-readme` can be configured using a variety of files, such as `package.json` with an `autoreadme` property, or a standalone `.autoreadmerc` file. For more information on configuration files, see [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig).

### Configuration File

You can configure `auto-readme` by creating a configuration file (or object) in the root of your project. The following file formats are supported:

- `package.json`
- `.autoreadmerc.cjs`
- `.autoreadmerc.js`
- `.autoreadmerc.json`
- `.autoreadmerc.mjs`
- `.autoreadmerc.toml`
- `.autoreadmerc.ts`
- `.autoreadmerc.yaml`
- `.autoreadmerc.yml`
- `.autoreadmerc`
- `.config/.autoreadmerc.json`
- `.config/.autoreadmerc.toml`
- `.config/.autoreadmerc.yaml`
- `.config/.autoreadmerc.yml`
- `.config/.autoreadmerc`
- `.config/autoreadmerc.cjs`
- `.config/autoreadmerc.js`
- `.config/autoreadmerc.json`
- `.config/autoreadmerc.mjs`
- `.config/autoreadmerc.toml`
- `.config/autoreadmerc.ts`
- `.config/autoreadmerc.yaml`
- `.config/autoreadmerc.yml`
- `.config/autoreadmerc`
- `autoreadme.config.cjs`
- `autoreadme.config.js`
- `autoreadme.config.mjs`
- `autoreadme.config.ts`

#### JSON Example

```json
{
  "$schema": "./node_modules/@stephansama/auto-readme/dist/schema.json",
  "disableEmojis": true
}
```

#### YAML Example

```yaml
# yaml-language-server: $schema=./node_modules/@stephansama/auto-readme/config/schema.yaml
disableEmojis: true
```

#### JavaScript Example

```javascript
/** @type {import("@stephansama/auto-readme").Config} */
export default {
  disableEmojis: true,
};
```

#### TypeScript Example

```typescript
import type { Config } from "@stephansama/auto-readme";

export default {
  disableEmojis: true,
} satisfies Config;
```

### Ignoring files

Use `ignoreGlobs` to skip markdown files. Globs are matched relative to the git root and are also applied when running with `--changes`. `node_modules` is always ignored.

```json
{
  "ignoreGlobs": ["examples/**", "**/CHANGELOG.md"]
}
```

The same option is available on the cli with `--ignoreGlobs` / `-i`. Quote each glob so the shell does not expand it (`-i "examples/**"`).

### Schema

<!-- ZOD path="./src/schema.js" start -->

# Zod Schema

## Actions

Comment action options

_Enum, one of the following possible values:_

- `'ACTION'`
- `'PKG'`
- `'USAGE'`
- `'WORKSPACE'`
- `'ZOD'`
- `'BADGE'`

## BadgeDependencyTypeOptions

_Array of `'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies'` items._

_Default value:_ `["dependencies","devDependencies"]`

## Config

_Object containing the following properties:_

| Property                    | Description                                                                                | Type                                                                                                                                                                                                                                                                                                                                                                                                      | Default                                                                                                                                                                                                                                                                                                                                                                                        |
| :-------------------------- | :----------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`affectedRegexes`** (\*)  |                                                                                            | `Array<string>`                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                |
| `badgeOptions`              |                                                                                            | _Object with properties:_<ul><li>`dependencyTypes`: [BadgeDependencyTypeOptions](#badgedependencytypeoptions)</li><li>`templates`: _Array of objects:_<br /><ul><li>**`image`** (\*): `string`</li><li>**`label`** (\*): `string`</li><li>**`url`** (\*): `string`</li></ul> - handlebar template strings where {{scope}}, {{name}} / {{key}} and {{version}} / {{value}} represent the package</li></ul> | `{"dependencyTypes":["dependencies","devDependencies"],"templates":[]}`                                                                                                                                                                                                                                                                                                                        |
| **`collapseHeadings`** (\*) |                                                                                            | `Array<string>`                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                                |
| `defaultLanguage`           | Default language to infer projects from                                                    | [Language](#language)                                                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                                                                                                                                                                                                                                                                                                |
| `disableEmojis`             | Whether or not to use emojis in markdown table headings                                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `disableMarkdownHeadings`   | Whether or not to display markdown headings                                                | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `enablePrettier`            | Whether or not to use prettier to format the files                                         | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `true`                                                                                                                                                                                                                                                                                                                                                                                         |
| `enableToc`                 | generate table of contents for readmes                                                     | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `enableUsage`               | Whether or not to enable usage plugin                                                      | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `headings`                  | List of headings for different table outputs                                               | _Object with dynamic keys of type_ [Actions](#actions) _and values of type_ `Array<'default' \| 'description' \| 'devDependency' \| 'downloads' \| 'name' \| 'private' \| 'required' \| 'version'>` (_optional_)                                                                                                                                                                                          | `{"ACTION":["name","required","default","description"],"BADGE":[],"PKG":["name","version","devDependency"],"USAGE":[],"WORKSPACE":["name","version","downloads","description"],"ZOD":[]}`                                                                                                                                                                                                      |
| `ignoreGlobs`               | Globs relative to the git root of markdown files to skip (node\_modules is always ignored) | `Array<string>`                                                                                                                                                                                                                                                                                                                                                                                           | `[]`                                                                                                                                                                                                                                                                                                                                                                                           |
| `onlyReadmes`               | Whether or not to only traverse readmes                                                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `true`                                                                                                                                                                                                                                                                                                                                                                                         |
| `onlyShowPublicPackages`    | Only show public packages in workspaces                                                    | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |
| `removeScope`               | Remove common workspace scope                                                              | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `''`                                                                                                                                                                                                                                                                                                                                                                                           |
| `templates`                 | Handlebars templates used to fuel list and table generation                                | _Object with properties:_<ul><li>`downloadImage`: `string`</li><li>`emojis`: `Record<'default' \| 'description' \| 'devDependency' \| 'downloads' \| 'name' \| 'private' \| 'required' \| 'version', string>` - Table heading emojis used when enabled</li><li>`registryUrl`: `string`</li><li>`versionImage`: `string`</li></ul>                                                                         | `{"downloadImage":"https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F","emojis":{"default":"⚙️","description":"📝","devDependency":"💻","downloads":"📥","name":"🏷️","private":"🔒","required":"","version":""},"registryUrl":"https://www.npmx.dev/package/{{name}}","versionImage":"https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F"}` |
| `tocHeading`                | Markdown heading used to generate table of contents                                        | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `'Table of contents'`                                                                                                                                                                                                                                                                                                                                                                          |
| `usageFile`                 | Workspace level usage file                                                                 | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `''`                                                                                                                                                                                                                                                                                                                                                                                           |
| `usageHeading`              | Markdown heading used to generate usage example                                            | `string`                                                                                                                                                                                                                                                                                                                                                                                                  | `'Usage'`                                                                                                                                                                                                                                                                                                                                                                                      |
| `verbose`                   | whether or not to display verbose logging                                                  | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                 | `false`                                                                                                                                                                                                                                                                                                                                                                                        |

_(\*) Required._ (_optional_)

## Formats

_Enum, one of the following possible values:_

- `'LIST'`
- `'TABLE'`

_Default value:_ `'TABLE'`

## Language

_Enum, one of the following possible values:_

- `'JS'`
- `'RS'`

_Default value:_ `'JS'`

<!-- ZOD end -->
