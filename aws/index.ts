// import { autoscalingGroup } from './autoscaling-group';
import { instance } from './instance';

// export const autoscalingGroupArn = autoscalingGroup.then(asg => asg.arn);
export const instanceArn = instance.then(i => i.arn);