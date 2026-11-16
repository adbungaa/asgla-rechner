-- LOOKUP MODULE


module Constants exposing (duesseldorferTabelle2023, duesseldorferTabelle2024, duesseldorferTabelle2025, duesseldorferTabelle2026, getHoechstbetrag, getKindergeld, getRegelbedarf, getSelbstbehalt, kindergeldTabelle, selbstbehalte)

import Dict exposing (Dict)
import Types exposing (Einkommensgruppe, Jahrgangstabelle)



-- Module for constant data (Düsseldorfer Tabelle, Kindergeld, and Selbstbehalte)
-- PFLEGEBEDARF


duesseldorferTabelle2023 : Jahrgangstabelle
duesseldorferTabelle2023 =
    { jahr = "2023"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 437 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 459 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 481 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 503 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 525 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 560 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 595 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 630 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 665 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 700 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 735 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 770 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 805 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 840 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 874 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 502 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 528 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 553 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 578 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 603 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 643 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 683 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 723 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 764 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 804 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 844 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 884 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 924 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 964 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 1004 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 588 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 618 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 647 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 677 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 706 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 753 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 800 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 847 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 894 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 941 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 988 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 1035 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 1082 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 1129 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 1176 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 628 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 660 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 691 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 723 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 754 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 804 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 855 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 905 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 955 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 1005 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 1056 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 1106 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 1156 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 1206 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 1256 }
                ]
          }
        ]
    }


duesseldorferTabelle2024 : Jahrgangstabelle
duesseldorferTabelle2024 =
    { jahr = "2024"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 480 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 504 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 528 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 552 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 576 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 615 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 653 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 692 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 730 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 768 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 807 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 845 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 884 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 922 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 960 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 551 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 579 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 607 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 634 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 662 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 706 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 750 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 794 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 838 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 882 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 926 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 970 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1014 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1058 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1102 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 645 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 678 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 710 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 742 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 774 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 826 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 878 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 929 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 981 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 1032 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 1084 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1136 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1187 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1239 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1290 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 689 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 724 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 758 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 793 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 827 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 882 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 938 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 993 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 1048 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 1103 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 1158 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1213 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1268 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1323 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1378 }
                ]
          }
        ]
    }


duesseldorferTabelle2025 : Jahrgangstabelle
duesseldorferTabelle2025 =
    { jahr = "2025"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 482 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 507 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 531 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 555 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 579 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 617 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 656 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 695 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 733 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 772 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 810 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 849 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 887 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 926 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 964 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 554 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 582 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 610 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 638 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 665 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 710 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 754 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 798 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 843 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 887 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 931 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 976 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1020 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1064 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1108 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 649 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 682 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 714 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 747 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 779 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 831 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 883 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 935 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 987 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 1039 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 1091 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1143 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1195 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1247 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1298 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 693 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 728 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 763 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 797 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 832 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 888 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 943 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 998 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 1054 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 1109 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 1165 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1220 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1276 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1331 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1386 }
                ]
          }
        ]
    }


duesseldorferTabelle2026 : Jahrgangstabelle
duesseldorferTabelle2026 =
    { jahr = "2026"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 486 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 511 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 535 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 559 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 584 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 623 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 661 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 700 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 739 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 778 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 817 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 856 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 895 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 934 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 972 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 558 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 586 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 614 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 642 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 670 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 715 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 759 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 804 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 849 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 893 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 938 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 983 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1027 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1072 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1116 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 653 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 686 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 719 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 751 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 784 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 836 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 889 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 941 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 993 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 1045 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 1098 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1150 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1202 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1254 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1306 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 698 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 733 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 768 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 803 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 838 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 894 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 950 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 1006 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 1061 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 1117 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 1173 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1229 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1285 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1341 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1396 }
                ]
          }
        ]
    }


zahlungsdeckelTabelle2023 : Jahrgangstabelle
zahlungsdeckelTabelle2023 =
    { jahr = "2023"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 312 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 334 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 356 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 378 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 400 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 435 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 470 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 505 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 540 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 575 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 610 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 645 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 680 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 715 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 749 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 377 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 403 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 428 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 453 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 478 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 518 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 558 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 598 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 639 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 679 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 719 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 759 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 799 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 839 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 879 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 463 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 493 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 522 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 552 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 581 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 628 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 675 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 722 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 769 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 816 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 863 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 910 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 957 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 1004 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 1051 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 1900, regelbedarf = 378 }
                , { einkommenVon = 1901, einkommenBis = 2300, regelbedarf = 410 }
                , { einkommenVon = 2301, einkommenBis = 2700, regelbedarf = 441 }
                , { einkommenVon = 2701, einkommenBis = 3100, regelbedarf = 473 }
                , { einkommenVon = 3101, einkommenBis = 3500, regelbedarf = 504 }
                , { einkommenVon = 3501, einkommenBis = 3900, regelbedarf = 554 }
                , { einkommenVon = 3901, einkommenBis = 4300, regelbedarf = 605 }
                , { einkommenVon = 4301, einkommenBis = 4700, regelbedarf = 655 }
                , { einkommenVon = 4701, einkommenBis = 5100, regelbedarf = 705 }
                , { einkommenVon = 5101, einkommenBis = 5500, regelbedarf = 755 }
                , { einkommenVon = 5501, einkommenBis = 6200, regelbedarf = 806 }
                , { einkommenVon = 6201, einkommenBis = 7000, regelbedarf = 856 }
                , { einkommenVon = 7001, einkommenBis = 8000, regelbedarf = 906 }
                , { einkommenVon = 8001, einkommenBis = 9500, regelbedarf = 956 }
                , { einkommenVon = 9501, einkommenBis = 11000, regelbedarf = 1006 }
                ]
          }
        ]
    }


zahlungsdeckelTabelle2024 : Jahrgangstabelle
zahlungsdeckelTabelle2024 =
    { jahr = "2024"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 355 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 379 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 403 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 427 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 451 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 490 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 528 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 567 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 605 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 643 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 682 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 720 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 759 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 797 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 835 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 426 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 454 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 482 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 509 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 537 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 581 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 625 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 669 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 713 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 757 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 801 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 845 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 889 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 933 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 977 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 520 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 553 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 585 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 617 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 649 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 701 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 753 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 804 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 856 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 907 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 959 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1011 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1062 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1114 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1165 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 439 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 474 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 508 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 543 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 577 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 632 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 688 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 743 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 798 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 853 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 908 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 963 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1018 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1073 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1128 }
                ]
          }
        ]
    }


zahlungsdeckelTabelle2025 : Jahrgangstabelle
zahlungsdeckelTabelle2025 =
    { jahr = "2025"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 354.5 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 379.5 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 403.5 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 427.5 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 451.5 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 489.5 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 528.5 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 567.5 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 605.5 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 644.5 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 682.5 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 721.5 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 759.5 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 798.5 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 836.5 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 426.5 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 454.5 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 482.5 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 510.5 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 537.5 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 582.5 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 626.5 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 670.5 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 715.5 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 759.5 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 803.5 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 848.5 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 892.5 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 936.5 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 980.5 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 521.5 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 554.5 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 586.5 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 619.5 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 651.5 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 703.5 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 755.5 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 807.5 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 859.5 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 911.5 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 963.5 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1015.5 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1067.5 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1119.5 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1170.5 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 438 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 473 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 508 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 542 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 577 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 633 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 688 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 743 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 799 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 854 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 910 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 965 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1021 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1076 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1131 }
                ]
          }
        ]
    }


zahlungsdeckelTabelle2026 : Jahrgangstabelle
zahlungsdeckelTabelle2026 =
    { jahr = "2026"
    , eintraege =
        [ { altersgruppe = "0-5"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 356.5 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 381.5 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 405.5 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 429.5 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 454.5 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 493.5 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 531.5 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 570.5 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 609.5 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 648.5 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 687.5 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 726.5 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 765.5 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 804.5 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 842.5 }
                ]
          }
        , { altersgruppe = "6-11"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 428.5 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 456.5 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 484.5 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 512.5 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 540.5 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 585.5 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 629.5 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 674.5 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 719.5 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 763.5 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 808.5 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 853.5 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 897.5 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 942.5 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 986.5 }
                ]
          }
        , { altersgruppe = "12-17"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 523.5 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 556.5 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 589.5 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 621.5 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 654.5 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 706.5 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 759.5 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 811.5 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 863.5 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 915.5 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 968.5 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 1020.5 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1072.5 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1124.5 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1176.5 }
                ]
          }
        , { altersgruppe = "18+"
          , einkommensgruppen =
                [ { einkommenVon = 0, einkommenBis = 2100, regelbedarf = 439 }
                , { einkommenVon = 2101, einkommenBis = 2500, regelbedarf = 474 }
                , { einkommenVon = 2501, einkommenBis = 2900, regelbedarf = 509 }
                , { einkommenVon = 2901, einkommenBis = 3300, regelbedarf = 544 }
                , { einkommenVon = 3301, einkommenBis = 3700, regelbedarf = 579 }
                , { einkommenVon = 3701, einkommenBis = 4100, regelbedarf = 635 }
                , { einkommenVon = 4101, einkommenBis = 4500, regelbedarf = 691 }
                , { einkommenVon = 4501, einkommenBis = 4900, regelbedarf = 747 }
                , { einkommenVon = 4901, einkommenBis = 5300, regelbedarf = 802 }
                , { einkommenVon = 5301, einkommenBis = 5700, regelbedarf = 858 }
                , { einkommenVon = 5701, einkommenBis = 6400, regelbedarf = 914 }
                , { einkommenVon = 6401, einkommenBis = 7200, regelbedarf = 970 }
                , { einkommenVon = 7201, einkommenBis = 8200, regelbedarf = 1026 }
                , { einkommenVon = 8201, einkommenBis = 9700, regelbedarf = 1082 }
                , { einkommenVon = 9701, einkommenBis = 11200, regelbedarf = 1137 }
                ]
          }
        ]
    }


kindergeldTabelle : Dict String Int
kindergeldTabelle =
    Dict.fromList
        [ ( "2023", 250 )
        , ( "2024", 250 )
        , ( "2025", 255 )
        , ( "2026", 259 )
        ]


selbstbehalte : Dict String (Dict String String)
selbstbehalte =
    Dict.fromList
        [ ( "2023"
          , Dict.fromList
                [ ( "Notwendig (nicht erwerbstätig)", "1120" )
                , ( "Notwendig", "1370" )
                , ( "Angemessen", "1650" )
                ]
          )
        , ( "2024"
          , Dict.fromList
                [ ( "Notwendig (nicht erwerbstätig)", "1200" )
                , ( "Notwendig", "1450" )
                , ( "Angemessen", "1750" )
                ]
          )
        , ( "2025"
          , Dict.fromList
                [ ( "Notwendig (nicht erwerbstätig)", "1200" )
                , ( "Notwendig", "1450" )
                , ( "Angemessen", "1750" )
                ]
          )
        , ( "2026"
          , Dict.fromList
                [ ( "Notwendig (nicht erwerbstätig)", "1200" )
                , ( "Notwendig", "1450" )
                , ( "Angemessen", "1750" )
                ]
          )
        ]


getKindergeld : String -> Int
getKindergeld jahr =
    Dict.get jahr kindergeldTabelle
        |> Maybe.withDefault 0


getSelbstbehalt : String -> String -> String
getSelbstbehalt jahr typ =
    case Dict.get jahr selbstbehalte of
        Just typDict ->
            case Dict.get typ typDict of
                Just betrag ->
                    betrag

                Nothing ->
                    "0"

        Nothing ->
            "0"



-- DUESSELDORFER TABELLE


getTabelleForYear : String -> Maybe Jahrgangstabelle
getTabelleForYear jahr =
    case jahr of
        "2023" ->
            Just duesseldorferTabelle2023

        "2024" ->
            Just duesseldorferTabelle2024

        "2025" ->
            Just duesseldorferTabelle2025

        "2026" ->
            Just duesseldorferTabelle2026

        _ ->
            Nothing


getAltersgruppe : Int -> String
getAltersgruppe age =
    if age <= 5 then
        "0-5"

    else if age <= 11 then
        "6-11"

    else if age <= 17 then
        "12-17"

    else
        "18+"


getRegelbedarf : String -> Float -> Int -> Maybe Float
getRegelbedarf jahr income alter =
    getTabelleForYear jahr
        |> Maybe.andThen
            (\tabelle ->
                -- Find entry for the child’s age group
                List.filter (\e -> e.altersgruppe == getAltersgruppe alter) tabelle.eintraege
                    |> List.head
            )
        |> Maybe.andThen
            (\eintrag ->
                -- Find regelbedarf based on income
                List.filterMap (matchIncome income) eintrag.einkommensgruppen
                    |> List.head
            )


matchIncome : Float -> Einkommensgruppe -> Maybe Float
matchIncome income { einkommenVon, einkommenBis, regelbedarf } =
    if income >= toFloat einkommenVon && income <= toFloat einkommenBis then
        Just regelbedarf

    else
        Nothing


getHoechstbetrag : String -> Float -> Int -> Maybe Float
getHoechstbetrag jahr income alter =
    getTabelleForYearHoechsbetrag jahr
        |> Maybe.andThen
            (\tabelle ->
                -- Find entry for the child’s age group
                List.filter (\e -> e.altersgruppe == getAltersgruppe alter) tabelle.eintraege
                    |> List.head
            )
        |> Maybe.andThen
            (\eintrag ->
                -- Find regelbedarf based on income
                List.filterMap (matchIncome income) eintrag.einkommensgruppen
                    |> List.head
            )


getTabelleForYearHoechsbetrag : String -> Maybe Jahrgangstabelle
getTabelleForYearHoechsbetrag jahr =
    case jahr of
        "2023" ->
            Just zahlungsdeckelTabelle2023

        "2024" ->
            Just zahlungsdeckelTabelle2024

        "2025" ->
            Just zahlungsdeckelTabelle2025

        "2026" ->
            Just zahlungsdeckelTabelle2026

        _ ->
            Nothing
