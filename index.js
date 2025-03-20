import fs from 'fs';

function normalizeString(product) {
    return product
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/-/g, ' ')
        .replace(' litros', 'l')
        .replace(' litro', 'l')
        .replace('1000ml', '1l')
        .replace(' quilos', 'kg')
        .replace(' quilo', 'kg')
        .replace(' gramas', 'g')
        .split(' ')
        .sort()
        .join(' ');
}

function compareProduct(product1, product2) {
    return normalizeString(product1) === normalizeString(product2);
}

function categorizeProducts(data) {
    const output = [];

    data.forEach((element) => {
        if (output.length == 0) {
            output.push({
                category: element.title,
                count: 1,
                products: [
                    {
                        title: element.title,
                        supermarket: element.supermarket,
                    },
                ],
            });
        } else {
            let sameProduct = false;
            let i = -1;

            while (!sameProduct && i < output.length - 1) {
                i++;
                sameProduct = compareProduct(output[i].category, element.title);
            }
            if (sameProduct) {
                output[i].count += 1;
                output[i].products.push({
                    title: element.title,
                    supermarket: element.supermarket,
                });
            } else {
                output.push({
                    category: element.title,
                    count: 1,
                    products: [
                        {
                            title: element.title,
                            supermarket: element.supermarket,
                        },
                    ],
                });
            }
        }
    });

    return output;
}

const input = fs.readFileSync('data01.json');
const data = JSON.parse(input);

const output = categorizeProducts(data);

fs.writeFileSync('data02.json', JSON.stringify(output, null, 2));
