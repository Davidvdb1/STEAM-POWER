// THIS FILE GENERATES DEFAULT DATA FOR THE DATABASE
// THIS CAN ALSO BE USED TO GENERATE seed.sql used by docker-compose

// USE: navigate to the backend and execute following command
// eg. commamd: node .\util\seed.js > .\seed.sql

import pool from '../db.js';
import mysql from "mysql2";


console.log('USE twa;');


const printAndExecute = async (x, y = []) => {
    let query = mysql.format(x, y);
    if (query.charAt(query.length - 1) !== ';') {
        query += ';';
    }
    console.log(query);
    return await pool.query(x, y);
}



const resetData = async () => {
    await printAndExecute('delete from building');
    await printAndExecute('delete from workshop');
    await printAndExecute('delete from component');
    await printAndExecute('delete from camp');
    await printAndExecute('delete from classroom');
    await printAndExecute('delete from user');
    await printAndExecute('delete from slider');
    await printAndExecute('delete from password_resets');

    await printAndExecute('delete from camp_workshop');
    await printAndExecute('delete from workshop_component');
    await printAndExecute('delete from classroom_power_building');


    await printAndExecute('ALTER TABLE building AUTO_INCREMENT = 1;');
    await printAndExecute('ALTER TABLE workshop AUTO_INCREMENT = 1;');
    await printAndExecute('ALTER TABLE component AUTO_INCREMENT = 1;');
    await printAndExecute('ALTER TABLE camp AUTO_INCREMENT = 1;');
    await printAndExecute('ALTER TABLE classroom AUTO_INCREMENT = 1;');
    await printAndExecute('ALTER TABLE user AUTO_INCREMENT = 1;');
    await printAndExecute('ALTER TABLE slider AUTO_INCREMENT = 1;');
    await printAndExecute('ALTER TABLE password_resets AUTO_INCREMENT = 1;');
}
await resetData();

const buildings = [
    {
        name: 'De Lijn Bus', cost_watt: 700.00, reward: 5,
        image: JSON.stringify({
            src: './img/bus.png', x: 0, y: 0, title: 'De Lijn Bus', modal_offset: { x: 130, y: 210 }, modalOpen: false,
            coords: [
                { x: 400, y: 670 }, { x: 399, y: 663 }, { x: 394, y: 658 }, { x: 390, y: 652 },
                { x: 361, y: 635 }, { x: 341, y: 626 }, { x: 334, y: 627 }, { x: 331, y: 634 },
                { x: 334, y: 644 }, { x: 346, y: 657 }, { x: 355, y: 657 }, { x: 365, y: 670 },
                { x: 377, y: 673 }, { x: 385, y: 678 }, { x: 392, y: 675 }
            ]
        })
    },
    {
        name: 'Speedboot', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/boot.png', x: 0, y: 0, title: 'Speedboot', modal_offset: { x: 450, y: 360 }, modalOpen: false,
                coords: [
                    { x: 924, y: 937 }, { x: 930, y: 937 }, { x: 937, y: 942 }, { x: 948, y: 946 },
                    { x: 959, y: 953 }, { x: 970, y: 950 }, { x: 979, y: 946 }, { x: 982, y: 937 },
                    { x: 982, y: 929 }, { x: 976, y: 921 }, { x: 970, y: 913 }, { x: 964, y: 904 },
                    { x: 957, y: 897 }, { x: 949, y: 886 }, { x: 940, y: 876 }, { x: 933, y: 868 },
                    { x: 924, y: 862 }, { x: 917, y: 858 }, { x: 907, y: 853 }, { x: 900, y: 856 },
                    { x: 894, y: 862 }, { x: 886, y: 865 }, { x: 880, y: 868 }, { x: 873, y: 869 },
                    { x: 864, y: 868 }, { x: 854, y: 867 }, { x: 845, y: 867 }, { x: 839, y: 871 },
                    { x: 839, y: 877 }, { x: 844, y: 884 }, { x: 848, y: 890 }, { x: 854, y: 896 },
                    { x: 861, y: 900 }, { x: 869, y: 906 }, { x: 879, y: 912 }, { x: 887, y: 916 },
                    { x: 895, y: 918 }, { x: 902, y: 923 }, { x: 909, y: 928 }, { x: 916, y: 931 }
                ]
            }
        )
    },
    {
        name: 'Cruiseschip', cost_watt: 1400.00, reward: 10,
        image: JSON.stringify(
            {
                src: './img/boot2.png', x: 0, y: 0, title: 'Cruiseschip', modal_offset: { x: 340, y: 390 }, modalOpen: false,
                coords: [
                    { x: 598, y: 925 }, { x: 617, y: 923 }, { x: 638, y: 919 }, { x: 657, y: 916 },
                    { x: 679, y: 911 }, { x: 697, y: 915 }, { x: 712, y: 922 }, { x: 720, y: 934 },
                    { x: 729, y: 944 }, { x: 733, y: 955 }, { x: 741, y: 965 }, { x: 741, y: 982 },
                    { x: 722, y: 989 }, { x: 701, y: 984 }, { x: 682, y: 975 }, { x: 660, y: 965 },
                    { x: 641, y: 954 }, { x: 618, y: 946 }
                ]
            }
        )
    },
    {
        name: 'Stadhuis', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/central_building.png', x: 0, y: 0, title: 'Stadhuis', modal_offset: { x: 215, y: 80 }, modalOpen: false,
                coords: [
                    { x: 304, y: 546 }, { x: 305, y: 514 }, { x: 316, y: 506 }, { x: 321, y: 490 },
                    { x: 333, y: 477 }, { x: 349, y: 468 }, { x: 366, y: 460 }, { x: 382, y: 455 },
                    { x: 394, y: 444 }, { x: 407, y: 439 }, { x: 409, y: 414 }, { x: 409, y: 391 },
                    { x: 411, y: 365 }, { x: 434, y: 349 }, { x: 458, y: 363 }, { x: 460, y: 389 },
                    { x: 460, y: 435 }, { x: 461, y: 450 }, { x: 468, y: 455 }, { x: 467, y: 439 },
                    { x: 466, y: 422 }, { x: 466, y: 401 }, { x: 466, y: 367 }, { x: 508, y: 347 },
                    { x: 515, y: 348 }, { x: 514, y: 304 }, { x: 536, y: 284 }, { x: 564, y: 305 },
                    { x: 562, y: 416 }, { x: 579, y: 413 }, { x: 595, y: 420 }, { x: 609, y: 432 },
                    { x: 622, y: 447 }, { x: 629, y: 455 }, { x: 646, y: 455 }, { x: 659, y: 460 },
                    { x: 668, y: 469 }, { x: 674, y: 478 }, { x: 676, y: 495 }, { x: 670, y: 509 },
                    { x: 667, y: 526 }, { x: 668, y: 541 }, { x: 651, y: 553 }, { x: 630, y: 563 },
                    { x: 608, y: 574 }, { x: 589, y: 585 }, { x: 572, y: 592 }, { x: 547, y: 581 },
                    { x: 525, y: 592 }, { x: 504, y: 600 }, { x: 482, y: 600 }, { x: 462, y: 602 },
                    { x: 444, y: 600 }, { x: 432, y: 604 }, { x: 407, y: 616 }, { x: 381, y: 603 },
                    { x: 358, y: 593 }, { x: 346, y: 573 }, { x: 323, y: 561 }
                ]
            }
        )
    },
    {
        name: 'Brandweer', cost_watt: 700.00, reward: 5,
        image: JSON.stringify({
            src: './img/brandweer.png', x: 0, y: 0, title: 'Brandweer', modal_offset: { x: 380, y: 230 }, modalOpen: false,
            coords: [
                { x: 680, y: 295 }, { x: 692, y: 285 }, { x: 705, y: 278 }, { x: 722, y: 273 },
                { x: 731, y: 259 }, { x: 744, y: 244 }, { x: 761, y: 245 }, { x: 776, y: 255 },
                { x: 788, y: 265 }, { x: 800, y: 278 }, { x: 809, y: 300 }, { x: 798, y: 314 },
                { x: 780, y: 325 }, { x: 760, y: 334 }, { x: 743, y: 344 }, { x: 724, y: 354 },
                { x: 708, y: 346 }, { x: 688, y: 336 }, { x: 677, y: 324 }
            ]
        })
    },
    {
        name: 'Flatgebouw', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/gebouw-midden-1.png', x: 0, y: 0, title: 'Flatgebouw', modal_offset: { x: 250, y: 180 }, modalOpen: false,
                coords: [
                    { x: 371, y: 180 }, { x: 380, y: 197 }, { x: 388, y: 214 }, { x: 398, y: 225 },
                    { x: 402, y: 244 }, { x: 400, y: 263 }, { x: 401, y: 281 }, { x: 413, y: 291 },
                    { x: 426, y: 301 }, { x: 443, y: 306 }, { x: 456, y: 319 }, { x: 442, y: 333 },
                    { x: 436, y: 347 }, { x: 417, y: 354 }, { x: 399, y: 360 }, { x: 386, y: 370 },
                    { x: 365, y: 372 }, { x: 345, y: 362 }, { x: 326, y: 351 }, { x: 304, y: 341 },
                    { x: 285, y: 331 }, { x: 280, y: 309 }, { x: 295, y: 295 }, { x: 309, y: 284 },
                    { x: 311, y: 261 }, { x: 312, y: 241 }, { x: 328, y: 229 }, { x: 343, y: 216 },
                    { x: 357, y: 207 }, { x: 364, y: 196 }
                ]
            }
        )
    },
    {
        name: 'Hotel', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/gebouw-midden-2.png',
                x: 0,
                y: 0,
                title: 'Hotel',
                modal_offset: { x: 80, y: 300 },
                modalOpen: false,
                coords: [
                    { x: 194, y: 525 }, { x: 184, y: 520 }, { x: 171, y: 518 }, { x: 156, y: 514 },
                    { x: 141, y: 506 }, { x: 132, y: 501 }, { x: 124, y: 494 }, { x: 114, y: 486 },
                    { x: 103, y: 481 }, { x: 90, y: 474 }, { x: 77, y: 467 }, { x: 64, y: 462 },
                    { x: 56, y: 457 }, { x: 47, y: 447 }, { x: 37, y: 436 }, { x: 29, y: 422 },
                    { x: 23, y: 412 }, { x: 32, y: 404 }, { x: 42, y: 397 }, { x: 47, y: 383 },
                    { x: 47, y: 367 }, { x: 47, y: 352 }, { x: 51, y: 341 }, { x: 59, y: 337 },
                    { x: 69, y: 333 }, { x: 78, y: 329 }, { x: 87, y: 324 }, { x: 96, y: 324 },
                    { x: 103, y: 330 }, { x: 113, y: 335 }, { x: 116, y: 347 }, { x: 119, y: 355 },
                    { x: 127, y: 353 }, { x: 136, y: 349 }, { x: 147, y: 345 }, { x: 156, y: 340 },
                    { x: 168, y: 335 }, { x: 176, y: 331 }, { x: 185, y: 327 }, { x: 193, y: 323 },
                    { x: 202, y: 322 }, { x: 215, y: 322 }, { x: 220, y: 329 }, { x: 230, y: 334 },
                    { x: 243, y: 342 }, { x: 252, y: 347 }, { x: 259, y: 352 }, { x: 271, y: 360 },
                    { x: 283, y: 365 }, { x: 322, y: 388 }, { x: 383, y: 418 }, { x: 355, y: 429 },
                    { x: 328, y: 438 }, { x: 305, y: 448 }, { x: 278, y: 464 }, { x: 238, y: 489 },
                    { x: 221, y: 509 }
                ]
            }
        )
    },
    {
        name: 'Kantoor gebouw', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/gebouw-rechts-boven.png',
                x: 0,
                y: 0,
                title: 'Kantoor gebouw',
                modal_offset: { x: 400, y: 180 },
                modalOpen: false,
                coords: [
                    { x: 903, y: 177 }, { x: 915, y: 172 }, { x: 925, y: 178 }, { x: 932, y: 187 },
                    { x: 933, y: 202 }, { x: 934, y: 213 }, { x: 934, y: 227 }, { x: 934, y: 239 },
                    { x: 933, y: 251 }, { x: 936, y: 264 }, { x: 926, y: 270 }, { x: 914, y: 277 },
                    { x: 903, y: 284 }, { x: 893, y: 289 }, { x: 884, y: 282 }, { x: 873, y: 277 },
                    { x: 869, y: 267 }, { x: 870, y: 255 }, { x: 869, y: 240 }, { x: 869, y: 229 },
                    { x: 869, y: 215 }, { x: 873, y: 199 }, { x: 884, y: 192 }, { x: 896, y: 189 }
                ]
            }
        )
    },
    {
        name: 'Metrostation', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/gebouw-rechts-boven-2.png',
                x: 0,
                y: 0,
                title: 'Metrostation',
                modal_offset: { x: 400, y: 150 },
                modalOpen: false,
                coords: [
                    { x: 1013, y: 257 }, { x: 1019, y: 262 }, { x: 1019, y: 275 }, { x: 1020, y: 284 },
                    { x: 1020, y: 295 }, { x: 1022, y: 306 }, { x: 1011, y: 310 }, { x: 998, y: 315 },
                    { x: 986, y: 318 }, { x: 976, y: 321 }, { x: 963, y: 323 }, { x: 950, y: 325 },
                    { x: 940, y: 321 }, { x: 931, y: 314 }, { x: 928, y: 303 }, { x: 930, y: 293 },
                    { x: 937, y: 286 }, { x: 944, y: 278 }, { x: 955, y: 275 }, { x: 957, y: 263 },
                    { x: 957, y: 249 }, { x: 957, y: 242 }, { x: 962, y: 234 }, { x: 971, y: 234 },
                    { x: 980, y: 232 }, { x: 988, y: 237 }, { x: 1001, y: 247 }
                ]
            }
        )
    },
    {
        name: 'Treinstation', cost_watt: 1400.00, reward: 10,
        image: JSON.stringify(
            {
                src: './img/gebouw-rechts-boven-3.png',
                x: 0,
                y: 0,
                title: 'Treinstation',
                modal_offset: { x: 300, y: 73 },
                modalOpen: false,
                coords: [
                    { x: 747, y: 73 }, { x: 758, y: 71 }, { x: 769, y: 72 }, { x: 777, y: 73 },
                    { x: 784, y: 78 }, { x: 792, y: 79 }, { x: 797, y: 87 }, { x: 801, y: 98 },
                    { x: 807, y: 104 }, { x: 814, y: 108 }, { x: 822, y: 115 }, { x: 833, y: 122 },
                    { x: 847, y: 122 }, { x: 855, y: 124 }, { x: 866, y: 133 }, { x: 883, y: 141 },
                    { x: 892, y: 149 }, { x: 897, y: 158 }, { x: 898, y: 171 }, { x: 889, y: 173 },
                    { x: 880, y: 180 }, { x: 871, y: 185 }, { x: 858, y: 192 }, { x: 847, y: 200 },
                    { x: 834, y: 208 }, { x: 818, y: 208 }, { x: 805, y: 206 }, { x: 792, y: 199 },
                    { x: 778, y: 193 }, { x: 764, y: 186 }, { x: 751, y: 179 }, { x: 735, y: 169 },
                    { x: 721, y: 159 }, { x: 700, y: 149 }, { x: 696, y: 141 }, { x: 704, y: 124 },
                    { x: 718, y: 113 }, { x: 717, y: 97 }, { x: 726, y: 89 }, { x: 736, y: 78 },
                ]
            }
        )
    },
    {
        name: 'Fabriek', cost_watt: 1400.00, reward: 10,
        image: JSON.stringify(
            {
                src: './img/gebouw-rechts-boven-4.png',
                x: 0,
                y: 0,
                title: 'Fabriek',
                modal_offset: { x: 270, y: 150 },
                modalOpen: false,
                coords: [
                    { x: 737, y: 378 }, { x: 747, y: 369 }, { x: 758, y: 361 }, { x: 771, y: 353 },
                    { x: 783, y: 345 }, { x: 785, y: 338 }, { x: 793, y: 332 }, { x: 801, y: 325 },
                    { x: 811, y: 320 }, { x: 821, y: 318 }, { x: 832, y: 318 }, { x: 839, y: 312 },
                    { x: 846, y: 309 }, { x: 855, y: 311 }, { x: 861, y: 317 }, { x: 871, y: 322 },
                    { x: 879, y: 326 }, { x: 891, y: 330 }, { x: 920, y: 346 }, { x: 906, y: 360 },
                    { x: 881, y: 370 }, { x: 862, y: 377 }, { x: 843, y: 388 }, { x: 824, y: 397 },
                    { x: 801, y: 406 }, { x: 782, y: 414 }, { x: 769, y: 415 }, { x: 757, y: 412 },
                    { x: 735, y: 395 }
                ]
            }
        )
    },
    {
        name: 'Winkelcentrum', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/shoppingcenter.png',
                x: 0,
                y: 0,
                title: 'Winkelcentrum',
                cost: 2000,
                reward: '50',
                modal_offset: { x: 450, y: 56 },
                modalOpen: false,
                coords: [
                    { x: 450, y: 56 }, { x: 460, y: 60 }, { x: 472, y: 61 }, { x: 483, y: 68 },
                    { x: 492, y: 76 }, { x: 493, y: 88 }, { x: 497, y: 99 }, { x: 509, y: 96 },
                    { x: 517, y: 87 }, { x: 527, y: 80 }, { x: 540, y: 77 }, { x: 552, y: 82 },
                    { x: 561, y: 87 }, { x: 571, y: 95 }, { x: 577, y: 105 }, { x: 583, y: 111 },
                    { x: 588, y: 121 }, { x: 599, y: 128 }, { x: 609, y: 136 }, { x: 619, y: 143 },
                    { x: 628, y: 149 }, { x: 636, y: 156 }, { x: 646, y: 165 }, { x: 656, y: 170 },
                    { x: 668, y: 174 }, { x: 676, y: 178 }, { x: 690, y: 183 }, { x: 701, y: 187 },
                    { x: 712, y: 193 }, { x: 726, y: 199 }, { x: 739, y: 208 }, { x: 738, y: 228 },
                    { x: 723, y: 237 }, { x: 689, y: 255 }, { x: 656, y: 269 }, { x: 604, y: 292 },
                    { x: 574, y: 278 }, { x: 544, y: 262 }, { x: 515, y: 241 }, { x: 490, y: 220 },
                    { x: 468, y: 200 }, { x: 422, y: 164 }, { x: 424, y: 76 }, { x: 437, y: 67 }
                ]
            }
        )
    },
    {
        name: 'Woonwijk 1', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/woning-zone-1.png',
                x: 0,
                y: 0,
                title: 'Woonwijk 1',
                modal_offset: { x: 351, y: 262 },
                modalOpen: false,
                coords: [
                    { x: 951, y: 362 }, { x: 1022, y: 404 }, { x: 1023, y: 550 }, { x: 1009, y: 560 },
                    { x: 979, y: 537 }, { x: 934, y: 512 }, { x: 897, y: 486 }, { x: 848, y: 462 },
                    { x: 815, y: 439 }, { x: 811, y: 428 }, { x: 817, y: 419 }, { x: 838, y: 409 },
                    { x: 871, y: 397 }, { x: 906, y: 382 }, { x: 930, y: 369 }
                ]
            }
        )
    },
    {
        name: 'Woonwijk 2', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/woning-zone-2.png',
                x: 0,
                y: 0,
                title: 'Woonwijk 2',
                modal_offset: { x: 2, y: 440 },
                modalOpen: false,
                coords: [
                    { x: 2, y: 486 }, { x: 18, y: 498 }, { x: 55, y: 518 }, { x: 99, y: 546 },
                    { x: 136, y: 573 }, { x: 158, y: 592 }, { x: 178, y: 606 }, { x: 179, y: 621 },
                    { x: 152, y: 631 }, { x: 120, y: 643 }, { x: 90, y: 657 }, { x: 55, y: 669 },
                    { x: 20, y: 681 }, { x: 0, y: 670 }
                ]
            }
        )
    },
    {
        name: 'Woonwijk 3', cost_watt: 700.00, reward: 5,
        image: JSON.stringify(
            {
                src: './img/woning-zone-3.png',
                x: 0,
                y: 0,
                title: 'Woonwijk 3',
                modal_offset: { x: 200, y: 50 },
                modalOpen: false,
                coords: [
                    { x: 1, y: 155 }, { x: 20, y: 147 }, { x: 38, y: 136 }, { x: 64, y: 121 },
                    { x: 141, y: 88 }, { x: 208, y: 134 }, { x: 227, y: 139 }, { x: 235, y: 154 },
                    { x: 272, y: 177 }, { x: 335, y: 221 }, { x: 323, y: 226 }, { x: 315, y: 239 },
                    { x: 307, y: 247 }, { x: 279, y: 257 }, { x: 227, y: 279 }, { x: 187, y: 295 },
                    { x: 129, y: 311 }, { x: 51, y: 335 }, { x: 31, y: 327 }, { x: 0, y: 308 }
                ]
            }
        )
    },
    {
        name: 'Haven/kust', cost_watt: 2800.00, reward: 20,
        image: JSON.stringify(
            {
                src: './img/haven-zone.png',
                x: 0,
                y: 0,
                title: 'Haven',
                modal_offset: { x: 346, y: 320 },
                modalOpen: false,
                coords: [
                    { x: 1, y: 809 }, { x: 34, y: 799 }, { x: 70, y: 790 }, { x: 97, y: 780 },
                    { x: 132, y: 763 }, { x: 170, y: 755 }, { x: 205, y: 747 }, { x: 241, y: 737 },
                    { x: 274, y: 728 }, { x: 318, y: 717 }, { x: 358, y: 712 }, { x: 398, y: 705 },
                    { x: 436, y: 697 }, { x: 474, y: 693 }, { x: 499, y: 690 }, { x: 531, y: 683 },
                    { x: 563, y: 679 }, { x: 592, y: 674 }, { x: 623, y: 671 }, { x: 645, y: 660 },
                    { x: 670, y: 646 }, { x: 695, y: 636 }, { x: 720, y: 618 }, { x: 741, y: 592 },
                    { x: 750, y: 569 }, { x: 761, y: 549 }, { x: 764, y: 517 }, { x: 770, y: 493 },
                    { x: 786, y: 475 }, { x: 818, y: 464 }, { x: 846, y: 465 }, { x: 873, y: 474 },
                    { x: 895, y: 485 }, { x: 922, y: 501 }, { x: 946, y: 520 }, { x: 972, y: 531 },
                    { x: 1002, y: 548 }, { x: 1022, y: 560 }, { x: 1021, y: 873 }, { x: 997, y: 878 },
                    { x: 970, y: 876 }, { x: 951, y: 858 }, { x: 925, y: 849 }, { x: 908, y: 832 },
                    { x: 885, y: 826 }, { x: 858, y: 830 }, { x: 839, y: 834 }, { x: 830, y: 852 },
                    { x: 815, y: 870 }, { x: 792, y: 883 }, { x: 764, y: 898 }, { x: 739, y: 898 },
                    { x: 709, y: 899 }, { x: 677, y: 893 }, { x: 649, y: 901 }, { x: 628, y: 910 },
                    { x: 599, y: 913 }, { x: 563, y: 915 }, { x: 547, y: 927 }, { x: 533, y: 941 },
                    { x: 506, y: 954 }, { x: 475, y: 961 }, { x: 445, y: 971 }, { x: 420, y: 981 },
                    { x: 394, y: 1001 }, { x: 370, y: 1021 }, { x: 0, y: 1021 }
                ]
            }
        )
    }
];

// Insert buildings into the database
buildings.forEach(async (building, index) => {
    const [result] = await printAndExecute('INSERT INTO building SET ?', building);
    
});

const workshops = [
    {
        title: 'Namiddag 1 - Intro energie',
        text: ['Introductie rond thema energie'],
        steps: [
            'Smartgrid, windenergie, zonne-energie',
            'Opslag (batterij, verdeling energie)',
            'In spel formaat (kaartspel / app)',
            'Vooruitblik'
        ],
        links: [
            { text: 'https://www.circonopoly.be/', url: 'https://www.circonopoly.be/' }
        ],
        images: []
    },
    {
        title: 'Namiddag 2 - Zonne-energie',
        steps: [
            'Micro:bit + uitbreiding',
            'Licht intensiteit meten met de micro:bit',
            'Servo motor optimaliseren'
        ],
        links: [
            { text: 'https://microbit.org/news/2021-10-08/affordable-solar-panel-designed-by-students/', url: 'https://microbit.org/news/2021-10-08/affordable-solar-panel-designed-by-students/' },
            { text: 'https://www.ratoeducation.be/nl/solar-experimenters-kit-for-microbit.html', url: 'https://www.ratoeducation.be/nl/solar-experimenters-kit-for-microbit.html' }
        ],
        images: []
    },
    {
        title: 'Namiddag 3 - Hydro-energie',
        steps: [
            'Met micro:bit energie productie meten en opslaan',
            'Energie opwekken met een zelfgemaakt rad'
        ],
        links: [
            { text: 'https://microbit.org/teach/lessons/energy-awareness/', url: 'https://microbit.org/teach/lessons/energy-awareness/' }
        ],
        images: [
            { path: 'https://th.bing.com/th/id/R.3d88a927f8529dcba03364b09d98adbe?rik=JYmQaMVSULpYQg&riu=http%3a%2f%2fthewowstyle.com%2fwp-content%2fuploads%2f2015%2f01%2fnature-images.jpg&ehk=BNPsuSOUR7ATZ3EpRwxx1xFl7LUbO3tYlu1wFLCBrCE%3d&risl=&pid=ImgRaw&r=0', isUrl: 'true' },
        ]
    },
    {
        title: 'Namiddag 4 - Creatief met energieeeee',
        text: ['Doel: Stroomkring maken + boodschap formuleren via creatieve vorm'],
        steps: [
            'Optie 1: Lamp wordt uit plexiglas gemaakt. Circut gebruiken om een sjabloon te maken en deze op de plexi te kleven. Daarna bewerken ze deze met etching cream',
            'Optie 2: Lamp wordt uit plexiglas gemaakt. Aan de hand van een dremel bewerken ze het plexiglas en maken ze hier een schets op.'
        ],
        links: [],
        images: []
    }
];

// Function to insert workshops into the database
const insertWorkshop = async (workshop, index) => {
    try {
        // Insert workshop
        const [workshopResult] = await printAndExecute('INSERT INTO workshop (name) VALUES (?)', [workshop.title]);
        const workshopId = workshopResult.insertId;

        // Insert components and link to workshop
        let position = 1;

        // Insert steps as components
        for (const step of workshop.steps) {
            const [stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['stappen', JSON.stringify({ text: step }), workshopId]);
            await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, position]);
            position++;
        }

        // Insert "Interessante links:" as a component if there are links
        if (workshop.links.length > 0) {
            const [linksTitleComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['tekst', JSON.stringify({ text: 'Interessante links:' }), workshopId]);
            await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, linksTitleComponentResult.insertId, position]);
            position++;
        }

        // Insert links as components
        for (const link of workshop.links) {
            const [linkComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['link', JSON.stringify({ text: link.text, url: link.url }), workshopId]);
            await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, linkComponentResult.insertId, position]);
            position++;
        }

        // Insert afbeelding as components
        for (const afbeelding of workshop.images) {
            const [linkComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['afbeelding', JSON.stringify(afbeelding), workshopId]);
            await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, linkComponentResult.insertId, position]);
            position++;
        }
    } catch (err) {
        console.error('Error inserting workshop:', err);
    }
};


// Insert each workshop
workshops.forEach(async (workshop, index) => {
    await insertWorkshop(workshop, index);
});

const camps = [
    {
        title: 'Smart Gadget Shaping kamp (VK30)',
        start_date: '2024-07-08',
        end_date: '2024-07-12',
        start_time: '09:00:00',
        end_time: '15:30:00',
        starting_age: 10,
        ending_age: 12,
        location: 'UCLL Techniek- en WetenschapsAcademie Leuven - Naamsesteenweg 355 , 3001 Heverlee',
        content: { path: "https://api.ledenbeheer.be/?q=render_preview&club=1727650&fid=783541&format=700x", isUrl: true },
        archived: false
    }
]

const insertCamp = async (camp, index) => {
    try {
        // Insert workshop
        await printAndExecute('INSERT INTO camp (title, start_date, end_date, start_time, end_time, starting_age, ending_age, location, content, archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [camp.title, camp.start_date, camp.end_date, camp.start_time, camp.end_time, camp.starting_age, camp.ending_age, camp.location, JSON.stringify(camp.content), camp.archived]);
    } catch (err) {
        console.error('Error inserting camp:', err);
    }
};

camps.forEach(async (camp, index) => {
    await insertCamp(camp, index);
});

await printAndExecute('INSERT INTO camp_workshop (camp_id, workshop_id, position) VALUES (?, ?, ?);', [1, 1, 1]);

await printAndExecute('INSERT INTO camp_workshop (camp_id, workshop_id, position) VALUES (?, ?, ?);', [1, 2, 2]);

await printAndExecute('INSERT INTO camp_workshop (camp_id, workshop_id, position) VALUES (?, ?, ?);', [1, 3, 3]);

await printAndExecute('INSERT INTO camp_workshop (camp_id, workshop_id, position) VALUES (?, ?, ?);', [1, 4, 4]);


/* START add micro:bit workshop */
const [workshopResult] = await printAndExecute("INSERT INTO workshop (name, archived) VALUES ('micro:bit workshop', false);");
const workshopId = workshopResult.insertId;

var [stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['stappen', '{\"text\":\"Stap 1: Connecteer het zonenpaneeltje met het \\\"Solar store\\\" bordje (+ aan + en - aan -).\"}', workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 1]);
[stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['afbeelding', JSON.stringify({path: 'assets/microbitWorkshop/microbit-workshop1.jpg', isUrl: 'false', 'fileName': 'microbit-workshop1.jpg'}), workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 2]);

var [stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['stappen', '{\"text\":\"Stap 2: Connecteer de pin \\\"GND\\\" van het \\\"Solar store\\\" aan de Micro:bit zijn \\\"GND\\\" pin.\"}', workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 3]);
[stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['afbeelding', JSON.stringify({path: 'assets/microbitWorkshop/microbit-workshop2.jpg', isUrl: 'false', 'fileName': 'microbit-workshop1.jpg'}), workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 4]);

var [stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['stappen', '{\"text\":\"Stap 3: Connecteer de pin \\\"3V\\\" van het \\\"Solar store\\\" aan de Micro:bit zijn \\\"3V\\\" pin. Nu zou er een lampje moeten branden op de Solar Store, dit betekent dat hij aan staat.\"}', workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 5]);
[stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['afbeelding', JSON.stringify({path: 'assets/microbitWorkshop/microbit-workshop3.jpg', isUrl: 'false', 'fileName': 'microbit-workshop1.jpg'}), workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 6]);


var [stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['stappen', '{\"text\":\"Stap 4: Connecteer de aanknop pin van het \\\"Solar store\\\" bordje met pin 2 van de micro:bit.\"}', workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 7]);
[stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['afbeelding', JSON.stringify({path: 'assets/microbitWorkshop/microbit-workshop4.jpg', isUrl: 'false', 'fileName': 'microbit-workshop1.jpg'}), workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 8]);


var [stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['stappen', '{\"text\":\"Stap 5: Connecteer de batterij icoon pin van het \\\"Solar store\\\" bordje met pin 0 van de micro:bit.\"}', workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 9]);
[stepComponentResult] = await printAndExecute('INSERT INTO component (type, content, workshop_id) VALUES (?, ?, ?)', ['afbeelding', JSON.stringify({path: 'assets/microbitWorkshop/microbit-workshop5.jpg', isUrl: 'false', 'fileName': 'microbit-workshop1.jpg'}), workshopId]);
await printAndExecute('INSERT INTO workshop_component (workshop_id, component_id, position) VALUES (?, ?, ?)', [workshopId, stepComponentResult.insertId, 10]);

await printAndExecute('INSERT INTO camp_workshop (camp_id, workshop_id, position) VALUES (?, ?, ?);', [1, workshopId, 5]);


/* END add micro:bit workshop */


// Insert slider
await printAndExecute('INSERT INTO slider (multiplier) VALUES (?);', [50]);


// insert admin user
// password used: Admin#Secure$2024
await printAndExecute(`INSERT INTO user (username, email, password) VALUES ( ?, ?, ?);`, ['admin', 'twaleuvennoreply@gmail.com', '$2b$10$hUbsQyL1KAcKZaITIld.BOclW0QKHV7CRVQ6JoVwPEz3XYyn1fEuW']);
