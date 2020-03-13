//% color=190 weight=100 icon="\uf201" block="SX02"
namespace SX02 {
    let SX02_I2C_ADDR = 0x55
    let ADC_REG_CONF = 0x02
    let ADC_CONF_CYC_TIME_256 = 0x80
    let ADC_REG_RESULT = 0x00
    let voltage: number = 0
    let HIGH_STATE = 1.0
    let LOW_STATE = 0.5
    let state: boolean

    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(SX02_I2C_ADDR, buf);
    }

    function getreg(reg: number): number {
        pins.i2cWriteNumber(SX02_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SX02_I2C_ADDR, NumberFormat.UInt8BE);
    }

    function getUInt16BE(reg: number): number {
        pins.i2cWriteNumber(SX02_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SX02_I2C_ADDR, NumberFormat.UInt16BE);
    }


    setreg(ADC_REG_CONF, ADC_CONF_CYC_TIME_256);
    let conf: NumberFormat.Int8LE = getreg(ADC_REG_CONF);

    function readVoltage() {
        let a: NumberFormat.UInt8LE
        let b: NumberFormat.UInt8LE
        let data: NumberFormat.UInt16LE

        data = getUInt16BE(ADC_REG_RESULT);

        a = ((data & 0xFF00) >> 8);
        b = ((data & 0x00FF) >> 0);

        voltage = (((((a & 0x0F) * 256) + (b & 0xF0)) / 0x10) * (3.3 / 256));

    }

    //% blockId="getVoltage"
    //% block="SX02 get voltage"
    export function getVoltage(): number {
        readVoltage()
        return voltage;
    }

}