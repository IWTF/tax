let tax = dataBase => {
  var dataBase = JSON.parse(dataBase)

  var FundBase = parseFloat(dataBase.FundBase)
  var FundRate = parseFloat(dataBase.FundRate)
  var Monthsalary = parseFloat(dataBase.Monthsalary)
  var socialBase = parseFloat(dataBase.socialBase)



  // 输入合法性检验
  if (FundRate == '') {
    FundRate = 0.08
  } else {
    FundRate = FundRate / 100;
    console.log("fundrate: ", FundRate)
  }// 公积金比例默认为0.08
  
  if (FundBase == 0) {
    FundBase = Monthsalary
    socialBase = Monthsalary
  }

  // 职工住房公积金的月缴存额计算
  var fund = FundBase * FundRate
  if (fund >= 22500 * FundRate) {
    fund = 22500 * FundRate
  }

  // 去除三险一金后的工资 // 养老8%， 医疗2%， 失业0.5%
  var old = socialBase * 0.08
  if (old >= 1594.8) {
    old = 1594.8
  }
  var doctor = socialBase * 0.02
  if (doctor >= 398.7) {
    doctor = 398.7
  }
  var job = socialBase * 0.005
  if (job >= 99.67) {
    job = 99.67
  }
  Monthsalary = Monthsalary - old - doctor - job - fund


  console.log("fundBase ", FundBase)
  console.log("fundRate ", FundRate)
  console.log("Monthsalary: ", Monthsalary)
  console.log("socialBase: ", socialBase)

  // 月工资税收计算
  const lowest = 5000
  var tax
  if (Monthsalary <= lowest) {
    tax = Monthsalary - lowest
  } else {
    if (Monthsalary <= 8000) {
      tax = (Monthsalary - lowest) * 0.03
    } else {
      if (Monthsalary <= 17000) {
        tax = (Monthsalary - lowest) * 0.1 - 210
      } else {
        if (Monthsalary <= 30000) {
          tax = (Monthsalary - lowest) * 0.2 - 1410
        } else {
          if (Monthsalary <= 40000) {
            tax = (Monthsalary - lowest) * 0.25 - 2660
          } else {
            if (Monthsalary <= 60000) {
              tax = (Monthsalary - lowest) * 0.3 - 4410
            } else {
              if (Monthsalary <= 85000) {
                tax = (Monthsalary - lowest) * 0.35 - 7160
              } else {
                tax = (Monthsalary - lowest) * 0.45 - 15160
              }
            }
          }
        }
      }
    }
  }

  tax = tax.toFixed(2)
  console.log('函数时：： 本月工资交税金额为： ', tax)
  return tax
}

module.exports = {
  tax: tax
}