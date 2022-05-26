import { autoscalingGroup } from './autoscaling-group'; 

export const autoscalingGroupArn = autoscalingGroup.then(asg => asg.arn);